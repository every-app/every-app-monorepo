import { describe, it, expect } from "vitest";
import {
  generateDefaultSortKey,
  generateSortKeyBetween,
} from "./fractional-indexing";

describe("fractional-indexing", () => {
  describe("generateDefaultSortKey", () => {
    it("should generate unique sort keys for consecutive calls", () => {
      const key1 = generateDefaultSortKey();
      // Wait a tiny bit to ensure different timestamp
      const key2 = generateDefaultSortKey();

      expect(key1).not.toBe(key2);
    });

    it("should generate keys that sort in descending order for newer items", () => {
      const older = generateDefaultSortKey();
      // Small delay to ensure different timestamp
      const newer = generateDefaultSortKey();

      // Newer items should have lexicographically larger keys for DESC ordering
      expect(newer > older).toBe(true);
    });
  });

  describe("generateSortKeyBetween", () => {
    describe("basic cases", () => {
      it("should generate a key between two single-character keys", () => {
        const result = generateSortKeyBetween("a", "z");
        expect(result > "a").toBe(true);
        expect(result < "z").toBe(true);
      });

      it("should generate a key between adjacent characters", () => {
        const result = generateSortKeyBetween("a", "b");
        expect(result > "a").toBe(true);
        expect(result < "b").toBe(true);
      });

      it("should generate a key when only 'after' is provided", () => {
        const result = generateSortKeyBetween(undefined, "m");
        expect(result < "m").toBe(true);
      });

      it("should generate a key when only 'before' is provided", () => {
        const result = generateSortKeyBetween("m", undefined);
        expect(result > "m").toBe(true);
      });

      it("should generate a default key when both are undefined", () => {
        const result = generateSortKeyBetween(undefined, undefined);
        expect(result).toBeDefined();
        expect(typeof result).toBe("string");
      });
    });

    describe("edge cases", () => {
      it("should handle keys at the start of alphabet", () => {
        const result = generateSortKeyBetween("a", "b");
        expect(result > "a").toBe(true);
        expect(result < "b").toBe(true);
      });

      it("should handle keys at the end of alphabet", () => {
        const result = generateSortKeyBetween("y", "z");
        expect(result > "y").toBe(true);
        expect(result < "z").toBe(true);
      });

      it("should handle multi-character keys", () => {
        const result = generateSortKeyBetween("abc", "abd");
        expect(result > "abc").toBe(true);
        expect(result < "abd").toBe(true);
      });

      it("should handle keys where one is a prefix of the other", () => {
        const result = generateSortKeyBetween("a", "ab");
        expect(result > "a").toBe(true);
        expect(result < "ab").toBe(true);
      });
    });

    describe("DESC ordering scenarios (real-world use case)", () => {
      it("should work when moving item down in DESC-sorted list", () => {
        // List sorted DESC: ['z', 'y', 'x', 'w', 'v']
        // Drag index 1 (y) to index 3
        // Visual position: between 'w' (index 3) and 'v' (index 4)
        // beforeTodo=w, afterTodo=v
        // MUST swap params: pass lower key first
        const result = generateSortKeyBetween("v", "w");

        expect(result > "v").toBe(true);
        expect(result < "w").toBe(true);

        // Verify it sorts correctly in DESC order
        const sorted = ["z", "y", "x", "w", result, "v"].sort().reverse();
        const expectedIndex = sorted.indexOf(result);
        expect(expectedIndex).toBe(4); // Should be at index 4 (between w and v)
      });

      it("should work when moving item up in DESC-sorted list", () => {
        // List sorted DESC: ['z', 'y', 'x', 'w', 'v']
        // Drag index 3 (w) to index 1
        // Visual position: between 'z' (index 0) and 'y' (index 1)
        // beforeTodo=z, afterTodo=y
        // MUST swap params: pass lower key first
        const result = generateSortKeyBetween("y", "z");

        expect(result > "y").toBe(true);
        expect(result < "z").toBe(true);

        // Verify it sorts correctly in DESC order
        const sorted = ["z", result, "y", "x", "v"].sort().reverse();
        const expectedIndex = sorted.indexOf(result);
        expect(expectedIndex).toBe(1); // Should be at index 1 (between z and y)
      });

      it("should handle dragging to top of DESC list", () => {
        // Drag to position 0 (top)
        // beforeTodo=undefined, afterTodo='z' (current top item)
        // Need key > 'z'
        const result = generateSortKeyBetween("z", undefined);

        expect(result > "z").toBe(true);

        // Verify it appears at top in DESC order
        const sorted = [result, "z", "y", "x"].sort().reverse();
        expect(sorted[0]).toBe(result);
      });

      it("should handle dragging to bottom of DESC list", () => {
        // Drag to last position
        // beforeTodo='a' (current bottom), afterTodo=undefined
        // Need key < 'a'
        const result = generateSortKeyBetween(undefined, "a");

        expect(result < "a").toBe(true);

        // Verify it appears at bottom in DESC order
        const sorted = ["z", "y", "x", "a", result].sort().reverse();
        expect(sorted[sorted.length - 1]).toBe(result);
      });
    });

    describe("multiple insertions", () => {
      it("should allow many insertions between two keys", () => {
        let lower = "a";
        let upper = "z";
        const keys = [lower];

        // Insert 10 keys between 'a' and 'z'
        for (let i = 0; i < 10; i++) {
          const newKey = generateSortKeyBetween(lower, upper);
          expect(newKey > lower).toBe(true);
          expect(newKey < upper).toBe(true);
          keys.push(newKey);
          lower = newKey;
        }

        keys.push(upper);

        // Verify all keys are in correct order
        const sorted = [...keys].sort();
        expect(sorted).toEqual(keys);
      });

      it("should allow repeated insertions at the top (real-world scenario)", () => {
        // Simulate adding new todos to the top of the list repeatedly
        // Each new todo should get a unique sort key that appears first in DESC order
        const sortKeys: string[] = [];

        for (let i = 0; i < 5; i++) {
          const newKey = generateDefaultSortKey();
          sortKeys.push(newKey);
        }

        // All keys should be unique
        const uniqueKeys = new Set(sortKeys);
        expect(uniqueKeys.size).toBe(sortKeys.length);

        // When sorted in DESC order, newest items (created last) should appear first
        // Since newer items have larger keys, DESC sort puts them at the top
        const sorted = [...sortKeys].sort().reverse();
        // Sorted DESC should be: [newest (last created), ..., oldest (first created)]
        // Which is the reverse of creation order
        expect(sorted).toEqual([...sortKeys].reverse());
      });

      it("should create new todos that appear at the top of a DESC-ordered list", () => {
        // Simulate the real scenario: existing todos with sort keys from earlier timestamps
        // Using realistic timestamp-based keys (older timestamps = smaller values)
        const baseTimestamp = Date.now() - 10000; // 10 seconds ago
        const existingTodos = [
          { id: "1", sortKey: (baseTimestamp + 0).toString(36) },
          { id: "2", sortKey: (baseTimestamp + 1000).toString(36) },
          { id: "3", sortKey: (baseTimestamp + 2000).toString(36) },
        ];

        // Add a new todo with current timestamp (should be larger)
        const newTodo1 = {
          id: "4",
          sortKey: generateDefaultSortKey(),
        };

        // Wait a tiny bit and add another (should be even larger)
        const newTodo2 = {
          id: "5",
          sortKey: generateDefaultSortKey(),
        };

        // Combine all todos
        const allTodos = [...existingTodos, newTodo1, newTodo2];

        // Sort in DESC order (like the UI does)
        const sortedDesc = allTodos.sort((a, b) =>
          b.sortKey.localeCompare(a.sortKey),
        );

        // New todos should appear at the top (first positions)
        // Most recent (newTodo2) should be first, then newTodo1
        expect(sortedDesc[0].id).toBe("5");
        expect(sortedDesc[1].id).toBe("4");
      });
    });

    describe("real drag-and-drop simulation", () => {
      it("should correctly reorder items through multiple drags (DESC order)", () => {
        // Start with 5 items in DESC order
        const items = [
          { id: "1", sortKey: "e" },
          { id: "2", sortKey: "d" },
          { id: "3", sortKey: "c" },
          { id: "4", sortKey: "b" },
          { id: "5", sortKey: "a" },
        ];

        // Drag item at index 1 (d) to index 3
        // Position between index 3 (b) and index 4 (a)
        const newSortKey1 = generateSortKeyBetween(
          items[4].sortKey, // afterTodo (lower key)
          items[3].sortKey, // beforeTodo (higher key)
        );
        items[1].sortKey = newSortKey1;

        // Re-sort in DESC order
        items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        // Item '2' should now be at index 3
        expect(items[3].id).toBe("2");
        expect(items.map((i) => i.id)).toEqual(["1", "3", "4", "2", "5"]);

        // Drag item at index 0 (e) to index 2
        const draggedIndex = 0;
        const targetIndex = 2;
        const newSortKey2 = generateSortKeyBetween(
          items[targetIndex + 1].sortKey, // afterTodo
          items[targetIndex].sortKey, // beforeTodo
        );
        items[draggedIndex].sortKey = newSortKey2;

        // Re-sort in DESC order
        items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        // Item '1' should now be at index 2
        expect(items[2].id).toBe("1");
      });

      it("should handle edge case: dragging first item to second position", () => {
        const items = [
          { id: "1", sortKey: "z" },
          { id: "2", sortKey: "y" },
          { id: "3", sortKey: "x" },
        ];

        // Drag index 0 to index 1 (swap first two items)
        // Position between index 1 (y) and index 2 (x)
        const newSortKey = generateSortKeyBetween(
          items[2].sortKey, // afterTodo (x)
          items[1].sortKey, // beforeTodo (y)
        );
        items[0].sortKey = newSortKey;

        items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        expect(items.map((i) => i.id)).toEqual(["2", "1", "3"]);
      });

      it("should handle edge case: dragging last item to second-to-last position", () => {
        const items = [
          { id: "1", sortKey: "z" },
          { id: "2", sortKey: "y" },
          { id: "3", sortKey: "x" },
        ];

        // Drag index 2 to index 1 (swap last two items)
        // Position between index 0 (z) and index 1 (y)
        const newSortKey = generateSortKeyBetween(
          items[1].sortKey, // afterTodo (y)
          items[0].sortKey, // beforeTodo (z)
        );
        items[2].sortKey = newSortKey;

        items.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

        expect(items.map((i) => i.id)).toEqual(["1", "3", "2"]);
      });
    });
  });
});
