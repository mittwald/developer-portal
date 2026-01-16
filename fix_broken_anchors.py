import os
import re
from difflib import SequenceMatcher


def read_file_content(file_path):
    """Reads content from a file."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.readlines()
    except Exception as e:
        print(f"Error reading file '{file_path}': {e}")
        return []


def write_file_content(file_path, lines):
    """Writes modified content back to a file."""
    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.writelines(lines)
    except Exception as e:
        print(f"Error writing file '{file_path}': {e}")


def extract_anchors_from_file(file_path):
    """Extracts all anchors from markdown headers in the specified file."""
    anchors = []
    header_pattern = re.compile(r"^\s*(#{1,6})\s+(.+)$")  # Match markdown headers
    lines = read_file_content(file_path)

    for line in lines:
        match = header_pattern.match(line)
        if match:
            heading_text = match.group(2).strip().lower()
            anchor = re.sub(r"[^\w\-]", "", heading_text.replace(" ", "-"))  # Normalize heading
            anchors.append(anchor)
    return anchors


def find_closest_anchor(input_anchor, anchors):
    """Finds the closest anchor using Levenshtein similarity."""
    closest_match = None
    highest_ratio = 0.0

    for anchor in anchors:
        similarity = SequenceMatcher(None, input_anchor, anchor).ratio()
        if similarity > highest_ratio:
            highest_ratio = similarity
            closest_match = anchor

    return closest_match if highest_ratio > 0.7 else None


def find_number_prefixed_match(stripped_name, search_path='.'):
    """
    Finds the correct file or directory in `search_path` that matches `stripped_name`
    while considering number prefixes.
    """
    # for cur_path, dirnames, filenames in os.walk(search_path):
    print(f"Got args: {search_path} {stripped_name}")

    folder_blacklist = ['i18n', 'build', 'node_modules', 'versioned_docs']

    for cur_path, dirnames, filenames in os.walk(search_path):
        stripped = []

        skip = any(item in cur_path for item in folder_blacklist)

        if skip:
            continue

        for dirname in dirnames:
            full_path = os.path.join(cur_path, dirname)
            search_name = dirname
            if dirname[0].isdigit():
                search_name = dirname.split('-', 1)[-1]
            if search_name != stripped_name:
                continue
            print(f"Directory found! {full_path}")
            return full_path

        for filename in filenames:

            parts = filename.split('.')
            full_path = os.path.join(cur_path, filename)

            if len(parts) != 2:
                continue

            filename, ending = parts
            search_name = filename

            if not filename:
                continue

            if filename[0].isdigit():
                search_name = filename.split('-', 1)[-1]
            if search_name != stripped_name:
                continue
            return full_path
            print(f"File found! {full_path}")

    return None
    '''
    try:
        for entry in os.listdir(search_path):
            # Match full entry name with stripped prefix
            stripped_entry = entry.split("-", 1)[-1]
            if stripped_entry == stripped_name:
                return os.path.join(search_path, entry)
    except FileNotFoundError:
        print(f"Directory '{search_path}' not found. Skipping...")
    return None
    '''


def resolve_relative_path(source_file, rel_path):
    """
    Dynamically resolves the target file path by matching directories and file names
    after stripping number prefixes, and ignoring the 'changelog' folder.
    """
    normalized_path = os.path.normpath(rel_path.strip("./"))  # Normalize relative path
    parts = normalized_path.split(os.sep)  # Break into path components
    current_dir = os.path.dirname(source_file)  # Start relative to the source file

    for part in parts[:-1]:
        if part.startswith("changelog"):  # Skip changelog entirely
            return None
        current_dir = find_number_prefixed_match(part)
        if not current_dir:
            return None

    # Match the final file part
    final_part = parts[-1]  # File name (possibly without prefix)
    target_file = find_number_prefixed_match(final_part, search_path=current_dir)
    return target_file if target_file and target_file.endswith(".mdx") else None


def process_links_in_file(source_file):
    """
    Process a markdown file to find and fix broken links with anchors.
    Only links containing anchors (#anchor) will be processed.
    """
    links_pattern = re.compile(r"\[([^\]]+)\]\(([^#)]+?)#([^\)]+)\)")  # Matches [label](path#anchor)

    lines = read_file_content(source_file)
    updated_lines = []
    for line in lines:
        matches = links_pattern.findall(line)
        updated_line = line

        for label, rel_path, raw_anchor in matches:
            raw_link = f"{rel_path}#{raw_anchor}"  # Preserve raw link as logged in the source file
            target_file = resolve_relative_path(source_file, rel_path)  # Dynamically resolve file

            if not target_file:
                print(f"Target file not found for link '{raw_link}' in file '{source_file}'.")
                continue

            # Extract anchors from the resolved file
            anchors = extract_anchors_from_file(target_file)

            # Find the closest anchor
            closest_anchor = find_closest_anchor(raw_anchor, anchors)
            if closest_anchor:
                corrected_link = f"{rel_path}#{closest_anchor}"  # Replace with corrected anchor
                updated_line = updated_line.replace(f"{rel_path}#{raw_anchor}", corrected_link)
                print(f"Updated link in '{source_file}': '{raw_link}' → '{corrected_link}'")
            else:
                print(f"No matching anchor found for '{raw_anchor}' in file '{target_file}'. Leaving link unchanged.")

        updated_lines.append(updated_line)

    # Write the updated content back to the file
    write_file_content(source_file, updated_lines)
    print(f"Finished processing '{source_file}'.")


def main():
    print("Welcome to the final version of the Broken Anchor Fixer!")
    file_list = input("Enter file paths (comma-separated): ").strip().split(",")
    for file_path in map(str.strip, file_list):
        if not os.path.isfile(file_path):
            print(f"Error: File '{file_path}' does not exist. Skipping...")
            continue

        try:
            process_links_in_file(file_path)
        except Exception as e:
            print(f"An error occurred while processing '{file_path}': {e}")
            raise


if __name__ == "__main__":
    main()
