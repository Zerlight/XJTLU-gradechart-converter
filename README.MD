# XJTLU-Gradechart-Converter

This program is designed to convert gradecharts CRV into JSON files.

The program will automatically pick up files in the folder `./source` and output JSON files into the folder `./output`

The program supports two types of gradecharts: `MODULE STATISTICS` and `PROGRAMME STATISTICS`

The program will look for the keywords to recognize file types:

| KEYWORD | TYPE |
| Module code | MODULE STATISTICS |
| Programme Code | PROGRAMME STATISTICS |

## JSON File Structure

The Keyword for the entire JSON body will be the CODE. (Module Code or Programme Code)