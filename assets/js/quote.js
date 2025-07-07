document.addEventListener('DOMContentLoaded', function() {
  const bodyElement = document.body;
  const quotesData = bodyElement.dataset.quotes;

  if (quotesData) {
    try {
      // Clean up potential JSON issues
      let cleanedQuotesData = quotesData;
      
      const quotes = JSON.parse(cleanedQuotesData);
      if (quotes && quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        const quoteTextElement = document.getElementById('random-quote-text');
        const quoteAuthorElement = document.getElementById('random-quote-author');

        if (quoteTextElement && quoteAuthorElement && randomQuote && randomQuote.quote && randomQuote.author) {
          quoteTextElement.innerText = '"' + randomQuote.quote + '"';
          quoteAuthorElement.innerText = '— ' + randomQuote.author;
        }
      }
    } catch (e) {
      console.error("Error parsing quotes data:", e);
      // Fallback to default quote if parsing fails
      const quoteTextElement = document.getElementById('random-quote-text');
      const quoteAuthorElement = document.getElementById('random-quote-author');
      if (quoteTextElement && quoteAuthorElement) {
        quoteTextElement.innerText = '"Học, học nữa, học mãi."';
        quoteAuthorElement.innerText = '— V.I. Lenin';
      }
    }
  } else {
    // Optional: handle cases where quotes are not loaded
    const quoteTextElement = document.getElementById('random-quote-text');
    if (quoteTextElement) {
      // Keep the default quote or show a message
      // quoteTextElement.innerText = 'Could not load quotes.';
    }
  }
}); 