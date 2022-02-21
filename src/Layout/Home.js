import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";

function Home({ cardDecks, eventHandler }) {

    // Set a state variable for cardDeck array.
    const [deckPropStatus, setDeckPropStatus] = useState(false);

    // If the card deck array is loaded set the deckPropStatus to ture
    useEffect(() => {
        if (cardDecks.length) {
            setDeckPropStatus(true);
        }
    }, [deckPropStatus, cardDecks]);

    //if the deck status is true, render the mapped card deck table, if the array is not loaded yet display a loading screen.
    if (deckPropStatus) {
        return (
            <div>
                <Link to="/decks/new">
                    <button name="addCards" className="btn btn-secondary">
                        <span className="oi oi-plus mr-1"></span>Create Deck
                    </button>
                </Link>
                <table className="mt-2 border">
                    {cardDecks.map((deck) => {
                        return (
                            <tbody key={deck.id}>
                                <tr className="border-top">
                                    <td className="pt-2 pl-3">
                                        <h3>{deck.name}</h3>
                                    </td>
                                    <td className="pt-2 pl-5">
                                        <sub className="text-right text-secondary">
                                            {deck.cards.length} cards
                                        </sub>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pl-3">
                                        <p>{deck.description}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pl-3 pb-3">
                                        <Link to={`/decks/${deck.id}`}>
                                            <button name="view" className="btn btn-secondary mr-1">
                                                <span className="oi oi-eye  mr-1"></span>View
                                            </button>
                                        </Link>
                                        <Link to={`/decks/${deck.id}/study`}>
                                            <button name="study" className="btn btn-primary mr-1">
                                                <span className="oi oi-book  mr-1"></span>Study
                                            </button>
                                        </Link>
                                    </td>
                                    <td className="pl-0 pb-3 pr-3">
                                        <button
                                            name="delete"
                                            className="btn btn-danger ml-5"
                                            onClick={() => {
                                                const deckId = deck.id;
                                                return eventHandler(deckId);
                                            }}
                                        >
                                            <span className="oi oi-trash"></span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </table>
            </div>
        );
    } else {
        return (
            <table className="mt-2 border">
                <tbody>
                    <tr>
                        <td>
                            <h5>Loading Flashcards...</h5>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
} //end of function dont lose bracket

export default Home;
