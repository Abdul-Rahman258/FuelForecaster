import re

def analyze_headline(headline: str) -> float:
    """
    Analyzes a news headline (English or Urdu) and returns a fiscal panic score (0 to 100).
    A high score indicates the government is likely to enact a massive PDL tax hike.
    """
    if not headline:
        return 0.0

    headline_lower = headline.lower()
    
    # English Triggers
    high_panic_eng = ["imf demands", "levy increase", "pdl hike", "tax bomb", "petrol bomb", "imf tranche", "shortfall", "imf rejects"]
    medium_panic_eng = ["ogra summary", "finance minister", "tough decisions", "price revision", "petroleum levy"]
    
    # Urdu Triggers
    high_panic_urdu = ["آئی ایم ایف", "پٹرول بم", "لیوی میں اضافہ", "ٹیکس", "شارٹ فال"]
    medium_panic_urdu = ["اوگرا سمری", "وزیر خزانہ", "پٹرولیم مصنوعات", "قیمتوں میں اضافہ"]

    score = 0.0
    
    # Check High Panic
    for word in high_panic_eng + high_panic_urdu:
        if word in headline_lower:
            score += 40.0
            
    # Check Medium Panic
    for word in medium_panic_eng + medium_panic_urdu:
        if word in headline_lower:
            score += 20.0

    # Cap at 100
    return min(score, 100.0)

if __name__ == "__main__":
    # Test
    test_headline = "IMF demands immediate increase in petroleum levy to close shortfall"
    print(f"Headline: {test_headline}")
    print(f"Score: {analyze_headline(test_headline)}")
    
    test_urdu = "آئی ایم ایف کا پٹرولیم لیوی میں اضافے کا مطالبہ"
    print(f"\nHeadline: {test_urdu}")
    print(f"Score: {analyze_headline(test_urdu)}")
