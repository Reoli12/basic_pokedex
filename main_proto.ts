import { Array, String, HashMap, Match } from 'effect'
import { pipe } from "@effect/data/Function"

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
        this.PokeInfoNodes.innerHTML = ''

        console.log(`i ran: ${this.textBox.value}`)
        const pokemonName = String.toLowerCase(this.textBox.value)
        const pokeData = await this.fetcher.fetchPokemonData(pokemonName)
        this.nameNode.textContent = pokemonName
        
            this.shinySpriteSrc = pokeData.sprites.front_shiny
            this.defaultSpriteSrc = pokeData.sprites.front_default
        this.spriteNode.src = this.defaultSpriteSrc

        const pokeAbilitiesRaw = pokeData.abilities
        const pokeAbilities = this.parseAbilitiesArr(pokeAbilitiesRaw)
        this.abilitiesNode.textContent = pipe (
                                        pokeAbilities,
                                        Array.map((ability) => this.formatString(ability)),
                                        (formattedAbilities) => this.join(formattedAbilities, ', ')
                                    )
                                        
        for (const child of this.PokeInfoNodesArray) {
            this.PokeInfoNodes.appendChild(child)
        }
        this.view.showElement(this.PokeInfoNodes)

    }

    parseAbilitiesArr(abilitiesArray) {
        const arrLen = Array.length(abilitiesArray)
        let res: Array<string> = Array.empty()
    
        for (const i of Array.range(0, arrLen - 1)) {
            res = Array.append(res, abilitiesArray[i].ability.name) // idk why its structured like this
        }
        return res
    }

    formatString(s: string): string {
        // assumes non-formatted strings are all lowercaseand represent whitespaces as dashes
        return pipe (
            s,
            String.replace('-', ' '),
            String.capitalize
        )
    }

    join(strList: string[], separator: string): string {
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
}

async function main() { 
    const url: string = 'https://pokeapi.co/api/v2/pokemon'
    const root = document.querySelector('#root')!

    const fetcher = new PokeFetcher(url)
    const view = new PokedexView(root)
    const pokedex = new Pokedex(fetcher, view)

}

main()