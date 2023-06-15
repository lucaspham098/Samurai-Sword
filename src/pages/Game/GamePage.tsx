import React, { FC, useEffect, useState } from 'react';

const GamePage = () => {
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [winner, setWinner] = useState<string>('')

    const [player1Hand, setPlayer1Hand] = useState<object[]>([])
    const [player1Character, setPlayer1Character] = useState<Character>()
    const [player1Role, setPlayer1Role] = useState<Role>()
    const [player1Attacks, setPlayer1Attack] = useState<number>(1)
    const [player1Difficulty, setPlayer1Difficulty] = useState<number>()
    const [player1Health, setPlayer1Health] = useState<number>()
    const [player1HonourPoints, setPlayer1HonourPoints] = useState<number>()

    const [player2Hand, setPlayer2Hand] = useState<object[]>([])
    const [player2Character, setPlayer2Character] = useState<Character>()
    const [player2Role, setPlayer2Role] = useState<Role>()
    const [player2Attacks, setPlayer2Attack] = useState<number>(1)
    const [player2Difficulty, setPlayer2Difficulty] = useState<number>()
    const [player2Health, setPlayer2Health] = useState<number>()
    const [player2HonourPoints, setPlayer2HonourPoints] = useState<number>()

    const [player3Hand, setPlayer3Hand] = useState<object[]>([])
    const [player3Character, setPlayer3Character] = useState<Character>()
    const [player3Role, setPlayer3Role] = useState<Role>()
    const [player3Attacks, setPlayer3Attack] = useState<number>(1)
    const [player3Difficulty, setPlayer3Difficulty] = useState<number>()
    const [player3Health, setPlayer3Health] = useState<number>()
    const [player3HonourPoints, setPlayer3HonourPoints] = useState<number>()
    //add const if more than three players below
    const [turn, setTurn] = useState('')
    const [drawDeck, setDrawDeck] = useState<object[]>([])
    const [discardPile, setDiscardPile] = useState<object[]>([])


    interface Weapon {
        type: 'weapon';
        name: string;
        reach: number;
        damage: number;
    }

    interface Action {
        type: 'action';
        name: string;
        // effect: () => void;
    }

    interface Property {
        type: 'property';
        name: string;
        // effect: () => void;
    }

    interface Character {
        name: string;
        health: number;
    }

    interface Role {
        role: string;
        team: string;
        stars?: number
    }


    const mainDeck = [
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bokken',
            reach: 1,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kusarigama',
            reach: 2,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Bo',
            reach: 2,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Daikyu',
            reach: 5,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Nagayari',
            reach: 4,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Kiseri',
            reach: 1,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Shuriken',
            reach: 3,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Wakizashi',
            reach: 1,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Naginata',
            reach: 4,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Tanegashima',
            reach: 5,
            damage: 1,
        },
        {
            type: 'weapon',
            name: 'Nodachi',
            reach: 3,
            damage: 3,
        },
        {
            type: 'weapon',
            name: 'Kanabo',
            reach: 3,
            damage: 2,
        },
        {
            type: 'weapon',
            name: 'Katana',
            reach: 2,
            damage: 3,
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Jujitsu'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Tea Ceremony'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Battlecry'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Geisha'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Daiymo'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Divertion'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'action',
            name: 'Breathing'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Fast Draw'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Armor'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Focus'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
        {
            type: 'property',
            name: 'Bushido'
        },
    ]

    const characterDeck: Character[] = [
        {
            name: 'Benkai',
            health: 5,
        },
        {
            name: 'Kojiro',
            health: 5,
        },
        {
            name: 'Ushiwaka',
            health: 4,
        },
        {
            name: 'Ieyasu',
            health: 5,
        },
        {
            name: 'Chiyome',
            health: 4,
        },
        {
            name: 'Hanzo',
            health: 4,
        },
        {
            name: 'Goemon',
            health: 5,
        },
        {
            name: 'Tomoe',
            health: 5,
        },
        {
            name: 'Nobunaga',
            health: 5,
        },
        {
            name: 'Hideyoshi',
            health: 4,
        },
        {
            name: 'Musashi',
            health: 5,
        },
        {
            name: 'Ginchyo',
            health: 5,
        },
    ]

    const roleDeck: Role[] = [
        {
            role: 'Shogun',
            team: 'Shogun',
        },
        // {
        //     role: 'Samurai',
        //     team: 'Shogun',
        // },
        // {
        //     role: 'Samurai',
        //     team: 'Shogun',
        // },
        // {
        //     role: 'Ninja',
        //     team: 'Ninja',
        //     stars: 1
        // },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 2
        },
        {
            role: 'Ninja',
            team: 'Ninja',
            stars: 3
        },
        // {
        //     role: 'Ronin',
        //     team: 'Ronin',
        // },

    ]

    const shuffle = (arr: object[]): object[] => {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr
    }

    useEffect(() => {
        const shuffledMainDeck = shuffle(mainDeck)
        const shuffledRoleDeck = shuffle(roleDeck)
        const shuffledCharacterDeck = shuffle(characterDeck)

        setPlayer1Character(shuffledCharacterDeck.pop() as Character)
        setPlayer2Character(shuffledCharacterDeck.pop() as Character)
        setPlayer3Character(shuffledCharacterDeck.pop() as Character)

        setPlayer1Role(shuffledRoleDeck.pop() as Role)
        setPlayer2Role(shuffledRoleDeck.pop() as Role)
        setPlayer3Role(shuffledRoleDeck.pop() as Role)

        const newPlayer1Hand = []
        for (let i = 0; i < 4; i++) {
            newPlayer1Hand.push(shuffledMainDeck.pop())
            console.log(shuffledMainDeck.length)
        }
        setPlayer1Hand(newPlayer1Hand as object[])

        const newPlayer2Hand = []
        for (let i = 0; i < 5; i++) {
            newPlayer2Hand.push(shuffledMainDeck.pop())
            console.log(shuffledMainDeck.length)

        }
        setPlayer2Hand(newPlayer2Hand as object[])

        const newPlayer3Hand = []
        for (let i = 0; i < 5; i++) {
            newPlayer3Hand.push(shuffledMainDeck.pop())
            console.log(shuffledMainDeck.length)

        }
        setPlayer3Hand(newPlayer3Hand as object[])

        // console.log(shuffledMainDeck.length)
        setDrawDeck(shuffledMainDeck)
        console.log(drawDeck.length)
    }, [])

    return (
        <div>
            <h1>{drawDeck.length}</h1>
            <h1>{drawDeck.length}</h1>
            <h1>{drawDeck.length}</h1>
        </div>
    );
};

export default GamePage;