import { Array, String, HashMap, pipe, Match } from 'effect'

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
        

    PokeInfoNodes = document.createElement('div')
        nameNode = document.createElement('h2')
        spriteNode = document.createElement('img')
            defaultSpriteSrc: string
            shinySpriteSrc: string
        typeNode = document.createElement('p')
        statsNode = document.createElement('table')
        abilitiesNode = document.createElement('p')
        PokeInfoNodesArray = Array.make(
            this.nameNode, 
            this.spriteNode,
            this.typeNode, 
            this.abilitiesNode,
            this.statsNode, 
        )

    constructor(fetcher: PokeFetcher, view: PokedexView) {
        this.fetcher = fetcher
        this.view = view

        this.header.textContent = 'pokedex beta'
        this.searchButton.textContent = 'Search!'

        for (const child of this.basicNodesArray) {
            this.basicNodes.appendChild(child)
        }
        
        for (const child of this.PokeInfoNodesArray) {
            this.PokeInfoNodes.appendChild(child)
        }
        view.showElement(this.basicNodes)

        // event listeners
        this.searchButton.addEventListener('click', () => this.searchPokemon())
    }

    async searchPokemon() {
        console.log(`i ran: ${this.textBox.value}`)
        const pokemonName = String.toLowerCase(this.textBox.value)
        const pokeData = await this.fetcher.fetchPokemonData(pokemonName)
        this.nameNode.textContent = pokemonName
        
            this.shinySpriteSrc = pokeData.sprites.front_shiny
            this.defaultSpriteSrc = pokeData.sprites.front_default
        this.spriteNode.src = this.defaultSpriteSrc
        this.view.showElement(this.PokeInfoNodes)

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