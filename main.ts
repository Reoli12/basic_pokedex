import { Array, String, HashMap, pipe } from 'effect'

class PokeFetcher {
    url: string

    constructor(url: string) {
        this.url = url
    }

    async fetchPokemonData(pokemonName: string) {
        const pokemonURL = `${this.url}/${pokemonName}`
        const pokemonData = (await fetch(pokemonURL)).json()
        return pokemonData
    }
}

// const delay = (ms: number) => new Promise((resolve) => {setTimeout(resolve, ms)})

async function main() {
    const url: string = 'https://pokeapi.co/api/v2/pokemon'

    const fetcher = new PokeFetcher(url)

    const root = document.querySelector('#root')!
    
    const header = document.createElement('h1')
        header.textContent = 'pokedex beta'
    const textBox = document.createElement('input')
        textBox.defaultValue = 'search pokemon here'
        textBox.addEventListener('click', () => {
            if (textBox.value == textBox.defaultValue) {
                textBox.value = ''
            }
        })
        textBox.addEventListener('focusout', () => {
            if (textBox.value === '')
            {
                textBox.value = textBox.defaultValue
            }})
    const searchButton = document.createElement('button')
        searchButton.textContent = 'Search'

    // at this point, this would be better expressed as a class.
    let defaultSpriteSrc = String.empty
    let shinySpriteSrc = String.empty


        searchButton.addEventListener('click', async () => {
            const pokemonName = textBox.value
            const pokeData = await fetcher.fetchPokemonData(pokemonName)

            nameNode.textContent = pokemonName

            defaultSpriteSrc = pokeData.sprites.front_default
            shinySpriteSrc = pokeData.sprites.front_shiny
            spriteNode.src = defaultSpriteSrc // url: string

            const abilities = parseAbilitiesArr(pokeData.abilities)
                const abilitiesCapitalized = Array.map(abilities, formatString)
                abilitiesNode.textContent = 'Abilities: ' + join(abilitiesCapitalized, ', ')

            const types = parseTypesArr(pokeData.types)
                const typesUpper = Array.map(types, String.toUpperCase)
                typeNode.textContent = join(typesUpper, ' | ')

            const pokemonStats = pokeData.stats
                makeStatsTable(statsNode, pokemonStats) // mutates statsNode

            for (const pokeDataNode of Array.make(  nameNode, spriteNode, displayShinyButtonNode,
                                                    typeNode, abilitiesNode, statsNode)) {
                dataDisplayNode.appendChild(pokeDataNode)
            }

            root.appendChild(dataDisplayNode)

            // root.append(statsNode)
        })


        for (const child of Array.make(header, textBox, searchButton)) {
            root.appendChild(child)
        }

    const dataDisplayNode = document.createElement('pre') // preformatted
    // sprite, type, stats, abilities will depend on this node

    const displayShinyButtonNode = document.createElement('button')
        displayShinyButtonNode.textContent = 'See shiny'
        displayShinyButtonNode.addEventListener('click', () => {
            if (String.isNonEmpty(defaultSpriteSrc) && String.isNonEmpty(shinySpriteSrc)) {
                if (spriteNode.src === defaultSpriteSrc) {
                    spriteNode.src = shinySpriteSrc
                } else {
                    spriteNode.src = defaultSpriteSrc
                }
            }
        })
    


    const nameNode = document.createElement('h2')
    const spriteNode = document.createElement('img')
    const typeNode = document.createElement('p')
    const statsNode = document.createElement('table')
    const abilitiesNode = document.createElement('p')
}

function join(strList: string[], separator: string): string {
    let res = ''
    for (const elem of strList) {
        if (res === '' ) {
            res += elem
        } 
        else {
            res = `${res}${separator}${elem}`
        }
    }
    return res
}

function parseAbilitiesArr(abilitiesArray) {
    const arrLen = Array.length(abilitiesArray)
    let res: Array<string> = Array.empty()

    for (const i of Array.range(0, arrLen - 1)) {
        res = Array.append(res, abilitiesArray[i].ability.name) // idk why its structured like this
    }
    return res
}

function parseTypesArr(typesArr) {
    const arrLen = Array.length(typesArr)
    let res: Array<string> = Array.empty()

    for (const i of Array.range(0, arrLen - 1)) {
        res = Array.append(res, typesArr[i].type.name) // idk why its structured like this
    }
    return res
}

function formatString(s: string): string {
    // assumes non-formatted strings are all lowercaseand represent whitespaces as dashes
    return pipe (
        s,
        String.replace('-', ' '),
        String.capitalize
    )
}

function makeStatsTable(tableNode: HTMLTableElement, pokeStats) {
    tableNode.innerHTML = '' // clear children
    let statToValue: HashMap.HashMap<string, number> = HashMap.empty()

    const statKeyCount = Array.length(pokeStats)

    for (const i of Array.range(0, statKeyCount - 1)) {
        const statsObject = pokeStats[i]
        const statName = statsObject.stat.name as string
        const statVal = statsObject.base_stat as number

        statToValue = HashMap.set(statToValue, statName, statVal)
    }

    // constructing table
    const head = document.createElement('thead')
        const topRow = document.createElement('tr') //tr = table row

        // making header
        for (const header of Array.make('Base stat', 'Value')) {
            const headerCell = document.createElement('th')
            headerCell.textContent = header
            headerCell.scope = 'col'
            topRow.appendChild(headerCell)
        }
        head.appendChild(topRow)

        // making body
    const body = document.createElement('tbody')
        for (const [statName, statVal] of HashMap.entries(statToValue)) {
            console.log([statName, statVal])
            // statname on left col, statval on right
            const row = document.createElement('tr')
                const statNameNode = document.createElement('th')
                const statValNode = document.createElement('td')
                statNameNode.textContent = formatString(statName)
                statValNode.textContent = `   ${statVal}   `

                row.appendChild(statNameNode)
                row.appendChild(statValNode)
            body.appendChild(row)
        }
    for (const child of Array.make(head, body)) {
        console.log(child)
        tableNode.append(child)
    }
}

main()