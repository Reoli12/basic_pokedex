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
        spriteNode = document.createElement('div')
            spriteImg = document.createElement('img')
            defaultSpriteSrc: string
            shinySpriteSrc: string
            seeShinyButton = document.createElement('button')
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

        // setting default textContents
        this.header.textContent = 'pokedex beta'
        this.searchButton.textContent = 'Search!'
        this.seeShinyButton.textContent = 'See Shiny'
        this.textBox.defaultValue = 'search Pokemon here'

        for (const child of Array.make(this.spriteImg, this.seeShinyButton)) {
            this.spriteNode.appendChild(child)
        }

        for (const child of this.basicNodesArray) {
            this.basicNodes.appendChild(child)
        }
        
        for (const child of this.PokeInfoNodesArray) {
            this.PokeInfoNodes.appendChild(child)
        }
        view.showElement(this.basicNodes)

        // event listeners
        this.searchButton.addEventListener('click', () => this.searchPokemon())
        this.textBox.addEventListener('click', () => {
            if (this.textBox.value === this.textBox.defaultValue) {
                this.textBox.value = ''
            }
        })
        this.textBox.addEventListener('focusout', () => {
            if (this.textBox.value === '') {
                this.textBox.value = this.textBox.defaultValue
            }
        })
        this.seeShinyButton.addEventListener('click', () => this.showOppositeShinyState())
    }

    showOppositeShinyState() {
        if (this.spriteImg.src === '') {
            return
        }
        if (this.spriteImg.src === this.defaultSpriteSrc) {
            this.spriteImg.src = this.shinySpriteSrc
        } else {
            this.spriteImg.src = this.defaultSpriteSrc
        }
    }

    async searchPokemon() {
        this.PokeInfoNodes.innerHTML = ''

        console.log(`i ran: ${this.textBox.value}`)
        const pokemonName = String.toLowerCase(this.textBox.value)
        const pokeData = await this.fetcher.fetchPokemonData(pokemonName)
        this.nameNode.textContent = pokemonName
        
        this.shinySpriteSrc = pokeData.sprites.front_shiny
        this.defaultSpriteSrc = pokeData.sprites.front_default
        this.spriteImg.src = this.defaultSpriteSrc
        const pokeAbilitiesRaw = pokeData.abilities
        const pokeAbilities = this.parseAbilitiesArr(pokeAbilitiesRaw)
        this.abilitiesNode.textContent = pipe (
                                        pokeAbilities,
                                        Array.map((ability) => this.formatString(ability)),
                                        (formattedAbilities) => 'Abilities: ' + 
                                                                this.join(formattedAbilities, ', ')
                                    )
                                        
        const types = this.parseTypesArr(pokeData.types)
            const typesUpper = Array.map(types, String.toUpperCase)
            this.typeNode.textContent = this.join(typesUpper, ' | ')

        const pokemonStats = pokeData.stats
        this.makeStatsTable(pokemonStats)

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

    parseTypesArr(typesArr) {
        const arrLen = Array.length(typesArr)
        let res: Array<string> = Array.empty()
    
        for (const i of Array.range(0, arrLen - 1)) {
            res = Array.append(res, typesArr[i].type.name) // idk why its structured like this
        }
        return res
    }

    makeStatsTable(pokeStats) {
        this.statsNode.innerHTML = '' // clear children
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
                    statNameNode.textContent = this.formatString(statName)
                    statValNode.textContent = `   ${statVal}   `
    
                    row.appendChild(statNameNode)
                    row.appendChild(statValNode)
                body.appendChild(row)
            }
        for (const child of Array.make(head, body)) {
            console.log(child)
            this.statsNode.append(child)
        }
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