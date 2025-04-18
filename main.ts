import { Array, String } from 'effect'

class PokeFetcher {
    url: string

    constructor(url: string) {
        this.url = url
    }

    async fetchPokemonData(pokemonName: string) {
        // console.log(this.url)
        const pokemonURL = `${this.url}/${pokemonName}`
        const pokemonData = (await fetch(pokemonURL)).json()
        // const pokemonDataParsed = JSON.parse(pokemonData)
        // console.log(pokemonData)
        return pokemonData
    }
}

const delay = (ms: number) => new Promise((resolve) => {setTimeout(resolve, ms)})

async function main() {
    // const helper = new Pokedex()
    const url: string = 'https://pokeapi.co/api/v2/pokemon'

    const fetcher = new PokeFetcher(url)

    const root = document.querySelector('#root')!
    
    const header = document.createElement('h1')
    header.textContent = 'pokedex beta'
    const textBox = document.createElement('input')
    textBox.defaultValue = 'search pokemon here'
    const searchButton = document.createElement('button')
    searchButton.textContent = 'Search'

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

    searchButton.addEventListener('click', async () => {
        const pokemonName = textBox.value
        const pokeData = await fetcher.fetchPokemonData(pokemonName)
        // const dataDisplay = JSON.stringify(pokeData, null, 4)
        // console.log(dataDisplay)

        nameNode.textContent = pokemonName
        spriteNode.src = pokeData.sprites.front_default // url: string
        // console.log(pokeData.abilities[1].ability.name)

        const abilities = parseAbilitiesArr(pokeData.abilities)
        abilitiesNode.textContent = 'Abilities: ' + join(abilities, ', ')

        for (const pokeDataNode of Array.make(nameNode, spriteNode, abilitiesNode)) {
            dataDisplayNode.appendChild(pokeDataNode)
        }

        root.appendChild(dataDisplayNode)
    })


    for (const child of Array.make(header, textBox, searchButton)) {
        root.appendChild(child)
    }

    const dataDisplayNode = document.createElement('pre') // preformatted
    // sprite, type, stats, abilities will depend on this node

    const nameNode = document.createElement('h2')
    const spriteNode = document.createElement('img')
    const typeNode = document.createElement('p')
    const statsNode = document.createElement('div')
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
        console.log(abilitiesArray[i])
        res = Array.append(res, abilitiesArray[i].ability.name) // idk why its structured like this
    }
    return res
}

main()