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

class PokedexView {
    root: Element

    constructor(root: Element) {
        this.root = root
    } 

    showElement(node: HTMLElement) {
        this.root.appendChild(node)
    }
}

class Pokedex {
    fetcher: PokeFetcher
    root: Element
    view: PokedexView

    basicNodes = document.createElement('div')
        header = document.createElement('h1')
        textBox = document.createElement('input')
        searchButton = document.createElement('button')
        basicNodesArray = Array.make(this.header, this.textBox, this.searchButton)

    PokemonDataNodes = document.createElement('div')
        nameNode = document.createElement('h2')
        spriteNode = document.createElement('img')
            defaultSpriteSrc: string
            shinySpriteSrc: string
        typeNode = document.createElement('p')
        statsNode = document.createElement('table')
        abilitiesNode = document.createElement('p')

    constructor(fetcher: PokeFetcher, view: PokedexView) {
        this.fetcher = fetcher
        this.view = view

        this.header.textContent = 'pokedex beta'
        this.searchButton.textContent = 'Search!'

        for (const child of this.basicNodesArray) {
            this.basicNodes.appendChild(child)
        }
        view.showElement(this.basicNodes)
    }

}

async function main() {
    const url: string = 'https://pokeapi.co/api/v2/pokemon'
    const root = document.querySelector('#root')!

    const fetcher = new PokeFetcher(url)
    const view = new PokedexView(root)
    const pokedex = new Pokedex(fetcher, view)

}

main()