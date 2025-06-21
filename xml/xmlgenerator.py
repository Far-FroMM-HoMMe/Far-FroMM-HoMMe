# ------WARNING---------
# Please form the input csv file so that it only contains the objects that you want to generate.
# Otherwise, if the same file name exists, it will be re-written (locally saved edits will be lost).

import pandas as pd
import xml.etree.ElementTree as ET
from xml.dom import minidom
import os

# CSV path and output directory
csv_path = "xml\metadata.csv"
output_dir = r"C:\Users\shiho\Documents\Study\Unibo\MMMM\Far-FroMM-HoMMe\xml\xml_files"
os.makedirs(output_dir, exist_ok=True)

# mapping the narrativeName
narrative_map = {
    'T': 'teacher',
    'B': 'businessman',
    'P': 'phdstudent'
}

# read CSV file
df = pd.read_csv(csv_path)

# iterrate over each row
for idx, row in df.iterrows():
    # Skip rows with missing title
    if pd.isna(row["title"]):
        continue

    root = ET.Element("objects")
    artwork = ET.SubElement(root, "artwork", attrib={"xml:id": str(row["id"])})

    # base fields
    base_fields = [
        "creator", "title", "creationDate", "type", "medium", "measurements",
        "creationLocation", "currentLocation", "source", "style", "subject", "label", "theme", "creditLine" 
    ]
    for field in base_fields:
        ET.SubElement(artwork, field).text = str(row[field]) if pd.notna(row[field]) else ""

    # narrativeName 
    narratives_raw = str(row.get("narrativeName", "")).strip()
    narratives = [narrative_map[c] for c in narratives_raw if c in narrative_map]

    if len(narratives) == 1:
        ET.SubElement(artwork, "narrativeName").text = narratives[0]
    elif len(narratives) > 1:
        for i, name in enumerate(narratives, 1):
            ET.SubElement(artwork, "narrativeName", attrib={"n": str(i)}).text = name

    # imageURL
    image_urls = []
    if pd.notna(row.get("imageURL1", "")):
        image_urls.append(str(row["imageURL1"]))
    if pd.notna(row.get("imageURL2", "")):
        image_urls.append(str(row["imageURL2"]))

    if len(image_urls) == 1:
        ET.SubElement(artwork, "imageURL").text = image_urls[0]
    elif len(image_urls) > 1:
        for i, url in enumerate(image_urls, 1):
            ET.SubElement(artwork, "imageURL", attrib={"n": str(i)}).text = url

    # relativePath
    rel_paths = []
    if pd.notna(row.get("relativePath1", "")):
        rel_paths.append(str(row["relativePath1"]))
    if pd.notna(row.get("relativePath2", "")):
        rel_paths.append(str(row["relativePath2"]))

    if len(rel_paths) == 1:
        ET.SubElement(artwork, "relativePath").text = rel_paths[0]
    elif len(rel_paths) > 1:
        for i, path in enumerate(rel_paths, 1):
            ET.SubElement(artwork, "relativePath", attrib={"n": str(i)}).text = path

    # format the XML output, set title as filename, and save to output directory
    xml_str = minidom.parseString(ET.tostring(root, encoding="utf-8")).toprettyxml(indent="    ")
    file_title = str(row["title"]).replace(" ", "")
    file_name = f"{file_title}.xml"
    file_path = os.path.join(output_dir, file_name)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(xml_str)

print("XML file created")
