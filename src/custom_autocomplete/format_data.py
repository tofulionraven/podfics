""" Include any custom transformations needed to clean the fields and entries of the data set.
"""
import argparse
from pathlib import Path
from urllib.parse import urlparse

import pandas as pd
import yaml

image_maps = {
    "archiveofourown.org": "./imgs/archive_of_our_own.png",
    "open.spotify.com": "./imgs/spotify.png",
    "soundcloud.com": "./imgs/soundcloud.png",
    "archive.org": "./imgs/archive.png",
    "www.youtube.com": "./imgs/youtube.png",
    "drive.google.com": "./imgs/drive.png",
    # Add more images here "URL": "./images/filename.png",
}

def format_links(raw_link: str) -> str:
    stem = urlparse(raw_link).netloc

    if stem:
        img_link = image_maps[stem] if stem in image_maps else "./imgs/default.png"
        return f'<a href="{raw_link}" target="_blank"><img src="{img_link}" alt="{Path(img_link).stem}" class="link_icon"></a>'
    return ""



class DataCleaner:
    def __init__(self) -> None:
        parser = argparse.ArgumentParser(
            prog="dataprep",
            description="Custom data transformations before hosting for autocomplete.",
        )
        parser.add_argument("config_file", help="Path to the yaml configuration file.", default="config.yaml")
        self.args = parser.parse_args()

        with open(self.args.config_file, encoding="utf-8", mode="rt") as config_file:
            self.config = yaml.safe_load(config_file)
        self.config["clean_data"]["used_fields"] += ["ao3", "other"]

    def get_ao3_link(self, row: pd.DataFrame) -> str:
        for col in self.config["clean_data"]["link_fields"]:
            if "archiveofourown.org" in row[col]:
                return row[col]
        return ""

    def get_non_ao3_link(self, row: pd.DataFrame) -> str:
        for col in self.config["clean_data"]["link_fields"]:
            if row[col] != "" and "archiveofourown.org" not in row[col]:
                return row[col]
        return ""
    
    def link_cleanup(self, data: pd.DataFrame) -> pd.DataFrame:
        return data.assign(
            ao3=data.apply(self.get_ao3_link, axis=1),
            other=data.apply(self.get_non_ao3_link, axis=1)
        )
    
    def get_unique_streams(self, data) -> set:
        retval = {""}
        retval.update(data.ao3.apply(lambda x: urlparse(x).netloc).unique())
        retval.update(data.other.apply(lambda x: urlparse(x).netloc))
        retval.remove("")
        print("\n".join(sorted(list(retval))))
        return data
         
    def clean(self) -> None:
        data = pd.read_csv(self.config["raw_data"]["name"], header=0)
        data.columns = list(map(str.strip, data.columns))
        self.link_cleanup(data.fillna(""))
        data = (
            data.fillna("")
            .pipe(self.link_cleanup)
            .pipe(self.get_unique_streams)
            [self.config["clean_data"]["used_fields"]]
            .replace("", None)
            .assign(is_ao3=lambda x: ~x.ao3.isnull())
            .sort_values(["is_ao3", "Title"], ascending=[False, True])
            .assign(
                ao3=lambda x: x.ao3.apply(format_links),
                other=lambda x: x.other.apply(format_links)
            )
            .drop(columns=["is_ao3"])
            .fillna("")
        )
        data.to_csv(self.config["clean_data"]["name"], index=False, header=True)
        data.to_json(self.config["clean_data"]["json"], orient="records")


def main() -> None:
    DataCleaner().clean()

if __name__ == "__main__":
    main()
