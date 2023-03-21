function truncate(text, maxLength) {
  const words = text.split(' ');
  if (words.length > maxLength) {
    return words.slice(0, maxLength).join(' ') + '...';
  } else {
    return text;
  }
}
export default truncate;