import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.absolute() / '../data'

def save_analysis_to_files(analysis):
    """
    Save different sections of analysis to separate files in a data folder
    
    Args:
        analysis (dict): Analysis results from analyze_document function
    """
    # Ensure data directory exists
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save key points
    with open(DATA_DIR / 'key_points.txt', 'w', encoding='utf-8') as f:
        json.dump({'key_points': analysis['key_points']}, f, indent=4, ensure_ascii=False)
    
    # Save dates
    with open(DATA_DIR / 'dates.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis['dates'], f, indent=4, ensure_ascii=False)
    
    # Save monetary values
    with open(DATA_DIR / 'monetary_values.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis['monetary_values'], f, indent=4, ensure_ascii=False)
    
    # Save document references
    with open(DATA_DIR / 'document_references.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis['document_references'], f, indent=4, ensure_ascii=False)
    
    # Save sections
    with open(DATA_DIR / 'sections.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis['sections'], f, indent=4, ensure_ascii=False)
    
    # Save document type
    with open(DATA_DIR / 'document_type.txt', 'w', encoding='utf-8') as f:
        json.dump({
            'document_type': analysis['document_type'],
            'description': 'The type of document based on content analysis'
        }, f, indent=4, ensure_ascii=False)
    
    # Save case types
    with open(DATA_DIR / 'case_types.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis['case_types'], f, indent=4, ensure_ascii=False)
    
    # Save complete analysis
    with open(DATA_DIR / 'complete_analysis.txt', 'w', encoding='utf-8') as f:
        json.dump(analysis, f, indent=4, ensure_ascii=False)
    
    # Save summary
    with open(DATA_DIR / 'summary.txt', 'w', encoding='utf-8') as f:
        json.dump({'summary': analysis['summary']}, f, indent=4, ensure_ascii=False)
