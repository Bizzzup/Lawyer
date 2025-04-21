import PyPDF2
import docx
from pathlib import Path

def extract_text(file_path):
    """
    Extract text from various document types (PDF, DOCX, TXT)
    
    Args:
        file_path (str): Path to the document file
        
    Returns:
        str: Extracted text from the document
    """
    try:
        file_ext = Path(file_path).suffix.lower()
        
        if not file_ext:
            raise ValueError("File has no extension")
            
        if file_ext == '.pdf':
            return extract_text_from_pdf(file_path)
        elif file_ext == '.docx':
            return extract_text_from_docx(file_path)
        elif file_ext == '.txt':
            return extract_text_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}. Supported types are: .pdf, .docx, .txt")
    except Exception as e:
        raise ValueError(f"Error processing file: {str(e)}")

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n\n"
        return text

def extract_text_from_docx(docx_path):
    """Extract text from DOCX file"""
    doc = docx.Document(docx_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text_from_txt(txt_path):
    """Extract text from TXT file"""
    with open(txt_path, 'r', encoding='utf-8') as file:
        return file.read()