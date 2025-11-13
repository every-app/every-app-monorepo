/**
 * Fractional indexing utilities for ordering todos
 * Based on lexicographic string ordering
 */

// Counter to ensure uniqueness within the same millisecond
let counter = 0;
let lastTimestamp = 0;

/**
 * Generate a sort key for new todos that appears at the top of the list
 * Uses timestamp-based approach to ensure each new todo has a unique, increasing sort key
 */
export function generateDefaultSortKey(): string {
  // Use base36 encoding of timestamp to get lexicographically increasing keys
  // More recent todos have "larger" strings (e.g., "x..." -> "y..." -> "z...")
  // This ensures newest items appear first when sorted in descending order
  const timestamp = Date.now();

  // Reset counter if we're in a new millisecond
  if (timestamp !== lastTimestamp) {
    counter = 0;
    lastTimestamp = timestamp;
  } else {
    counter++;
  }

  // Combine timestamp and counter for uniqueness
  const combined = timestamp + counter;
  return combined.toString(36);
}

/**
 * Generate a sort key between two existing sort keys
 * @param before - The sort key that should come before the new key (optional)
 * @param after - The sort key that should come after the new key (optional)
 * @returns A sort key that will be ordered between before and after
 */
export function generateSortKeyBetween(
  before?: string,
  after?: string,
): string {
  // If no bounds provided, return default
  if (!before && !after) {
    return generateDefaultSortKey();
  }

  // If only after is provided, insert before it
  if (!before) {
    return generateSortKeyBefore(after!);
  }

  // If only before is provided, insert after it
  if (!after) {
    return generateSortKeyAfter(before!);
  }

  // Generate key between before and after
  return generateSortKeyBetweenTwo(before, after);
}

/**
 * Generate a sort key that comes before the given key (lexicographically smaller)
 */
function generateSortKeyBefore(key: string): string {
  // If the key starts with a character > 'a', decrement the first character
  if (key.charAt(0) > "a") {
    const firstChar = String.fromCharCode(key.charCodeAt(0) - 1);
    return firstChar + "z"; // Use 'z' to be just before the decremented character
  }

  // If the key is 'a' or starts with 'a', we need to go lexicographically earlier
  // We can't go before 'a', so we prepend a null byte or use a special prefix
  // For simplicity, use '0' which comes before 'a'
  if (key.charAt(0) === "a") {
    return "0" + key;
  }

  // For keys starting with characters before 'a' (like numbers)
  const firstChar = String.fromCharCode(key.charCodeAt(0) - 1);
  return firstChar + "z";
}

/**
 * Generate a sort key that comes after the given key
 */
function generateSortKeyAfter(key: string): string {
  // If the key starts with a character < 'z', increment the first character
  if (key.charAt(0) < "z") {
    const firstChar = String.fromCharCode(key.charCodeAt(0) + 1);
    return firstChar;
  }

  // If the key is 'z' or starts with 'z', append middle char
  return key + "n";
}

/**
 * Generate a sort key between two existing keys
 */
function generateSortKeyBetweenTwo(before: string, after: string): string {
  // Find the first position where the strings differ
  let i = 0;
  while (
    i < Math.min(before.length, after.length) &&
    before.charAt(i) === after.charAt(i)
  ) {
    i++;
  }

  // If one string is a prefix of the other
  if (i === before.length) {
    // before is prefix of after (e.g., "a" and "ab")
    // We need a character between "" and after.charAt(i)
    // Get the character at position i in 'after'
    const afterNextChar = after.charCodeAt(i);

    // If the next character in 'after' is 'a' or close to it, we need to go smaller
    if (afterNextChar === "a".charCodeAt(0)) {
      // Can't go below 'a', so extend with a character before 'a'
      return before + "0"; // '0' < 'a'
    }

    // Find midpoint between start of alphabet and the after character
    const midChar = String.fromCharCode(Math.floor(afterNextChar / 2));
    return before + midChar;
  }

  if (i === after.length) {
    // after is prefix of before (shouldn't happen if before < after)
    // but handle gracefully
    return generateSortKeyBefore(after);
  }

  // Strings differ at position i
  const beforeChar = before.charCodeAt(i);
  const afterChar = after.charCodeAt(i);

  // If characters are adjacent, we need to extend the string
  if (afterChar - beforeChar === 1) {
    // Characters are adjacent (like 'y' and 'z' at position 0)
    // We need to use the 'before' character and extend it
    // But first check if 'before' already has more characters after position i
    if (i + 1 < before.length) {
      // before has more characters (e.g., "yn" vs "z")
      // We need to generate something between "yn" and "z"
      // Since 'y' and 'z' are adjacent, append to before
      return before + "n";
    }
    // Use the before character and append middle character
    return before.substring(0, i + 1) + "n";
  }

  // Characters have space between them, find midpoint
  const midChar = String.fromCharCode(Math.floor((beforeChar + afterChar) / 2));
  return before.substring(0, i) + midChar;
}
