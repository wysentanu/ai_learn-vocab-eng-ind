// Parse CSV data
function parseCSV(text: string) {
  const lines = text.split("\n")
  const headers = lines[0].split(",")

  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = parseCsvLine(line)
      const entry: Record<string, string> = {}

      headers.forEach((header, index) => {
        entry[header] = values[index] || ""
      })

      return entry
    })
}

// Helper function to handle CSV parsing with quoted fields
function parseCsvLine(line: string) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  if (current) {
    result.push(current)
  }

  return result
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array: any[]) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Fetch vocabulary from CSV file
export async function fetchRandomWords(count: number) {
  try {
    const response = await fetch("/vocabularies.csv")
    if (!response.ok) {
      throw new Error("Failed to fetch vocabulary data")
    }

    const csvText = await response.text()
    const data = parseCSV(csvText)

    // Shuffle and take requested number of words
    const shuffled = shuffleArray(data)
    const selectedWords = shuffled.slice(0, count)

    // Map to the format expected by the app
    return selectedWords.map((word) => ({
      id: word.english_word,
      english: word.english_word,
      indonesian: word.bahasa_translation,
      pronunciation: word.pronunciation,
      example: word.example_usage,
    }))
  } catch (error) {
    console.error("Error fetching words:", error)
    return []
  }
}

