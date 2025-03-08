import fs from 'fs';
import { createReadStream, createWriteStream } from 'fs';
import { createInterface } from 'readline';
import path from 'path';

interface RawRecipe {
    id: string;
    title: string;
    ingredients: string;
    directions: string;
    link: string;
    source: string;
    NER: string;
}

interface ProcessedRecipe {
    id: number;
    title: string;
    ingredients: string[];
    directions: string[];
    link: string;
    source: number;
    NER: string[];
}

class RecipeConverter {
    private sourceMapping: { [key: string]: number } = {
        "Gathered": 0,
        "Recipes1M": 1
    };

    private parseListField(field: string): string[] {
        if (!field) {
            return [];
        }
        // Remove brackets and split by comma, then clean each item
        const items = field.trim().replace(/^\[|\]$/g, '').split(',');
        return items
            .map(item => item.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean);
    }

    private processRow(row: { [key: string]: string }): ProcessedRecipe | null {
        try {
            // Handle BOM character in the id field
            const idField = '\ufeffid' in row ? '\ufeffid' : 'id';

            return {
                id: parseInt(row[idField]),
                title: String(row['title']),
                ingredients: this.parseListField(row['ingredients']),
                directions: this.parseListField(row['directions']),
                link: String(row['link']),
                source: this.sourceMapping[row['source']] ?? 0,
                NER: this.parseListField(row['NER'])
            };
        } catch (error) {
            console.error('Error processing row:', row);
            console.error('Error message:', error);
            return null;
        }
    }

    async csvToJsonl(inputPath: string, outputPath: string): Promise<void> {
        try {
            const fileStream = createReadStream(inputPath, { encoding: 'utf-8' });
            const writeStream = createWriteStream(outputPath, { encoding: 'utf-8' });
            
            const rl = createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let headers: string[] = [];
            let isFirstLine = true;

            for await (const line of rl) {
                if (isFirstLine) {
                    headers = line.split(',').map(header => 
                        header.trim().replace(/^[\ufeff"]+|["]+$/g, '')
                    );
                    isFirstLine = false;
                    continue;
                }

                // Parse CSV line considering quoted fields
                const values = line.match(/(?:\"([^\"]*)\"|([^,]+))/g) || [];
                const row: { [key: string]: string } = {};
                
                values.forEach((value, index) => {
                    if (index < headers.length) {
                        row[headers[index]] = value.replace(/^"|"$/g, '');
                    }
                });

                const processedRow = this.processRow(row);
                if (processedRow) {
                    writeStream.write(JSON.stringify(processedRow) + '\n');
                }
            }

            writeStream.end();
            console.log(`Successfully converted ${inputPath} to ${outputPath}`);

        } catch (error) {
            if (error instanceof Error && error.message.includes('ENOENT')) {
                console.error(`Error: Could not find the input file ${inputPath}`);
            } else {
                console.error(`An error occurred: ${error}`);
            }
        }
    }
}

async function main() {
    const converter = new RecipeConverter();
    const inputFile = "/Users/gnand/Documents/sample.csv";
    const outputFile = "/Users/gnand/Documents/recipes.jsonl";
    await converter.csvToJsonl(inputFile, outputFile);
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error in main:', error);
        process.exit(1);
    });
}
