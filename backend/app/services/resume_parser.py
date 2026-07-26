import fitz  # PyMuPDF
import re


def clean_text(text: str) -> str:
    """
    Clean extracted PDF text for better parsing.
    """

    # Replace non-breaking spaces
    text = text.replace("\xa0", " ")

    # Remove multiple spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Insert spaces between lowercase and uppercase if missing
    # Example: dataPipeline -> data Pipeline
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)

    return text.strip()


def extract_text_from_pdf(file) -> tuple[str, int]:
    """
    Extract text from PDF while preserving layout.

    Returns:
        (text, page_count)
    """

    # Read uploaded PDF
    pdf = fitz.open(stream=file.file.read(), filetype="pdf")

    pages = len(pdf)

    all_text = []

    for page in pdf:

        # Extract text blocks
        blocks = page.get_text("blocks")

        # Sort blocks from top-to-bottom, then left-to-right
        blocks.sort(key=lambda block: (block[1], block[0]))

        for block in blocks:

            block_text = block[4].strip()

            if block_text:
                all_text.append(block_text)

    pdf.close()

    text = "\n".join(all_text)

    text = clean_text(text)

    return text, pages