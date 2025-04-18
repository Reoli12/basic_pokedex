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
        console.log(pokemonData)
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

    const dataDisplayNode = document.createElement('p')
    


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
        const dataDisplay = JSON.stringify(pokeData, null, 4)
        // console.log(pokeData)

        dataDisplayNode.textContent = dataDisplay
        root.appendChild(dataDisplayNode)
    })


    for (const child of Array.make(header, textBox, searchButton)) {
        root.appendChild(child)
    }

    // await helper.addDefaultValueToSearchBox(textBox)
}

main()