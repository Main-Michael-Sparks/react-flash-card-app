import React, { useEffect, useState } from "react";
import DeckForm from "./DeckForm";
import { Link, useParams } from "react-router-dom";


function EditDeck({deckArray}){

    // The deckState is set to true if the DeckArray prop is loaded
    // The deckName is extracted from the DeckArray and stored in state.
    const[deckState, setDeckState] = useState(false);
    const[deckName, setDeckName] = useState([]);
    const {deckId} = useParams();

    // A prop that tells "DeckFrom" which set of code to execute
    const edit ="edit";

    // If the deck array is loaded, then set deckState to true, next filter and store the deck array for the deck name. 
    useEffect(()=>{
        if (deckArray.length) {
            const getName = deckArray.filter( deck => {
                    if (deck.id === Number(deckId)){
                        return deck
                        };
                    })
            setDeckName([
              ...getName
            ]);
            setDeckState(true);
        };
    },[deckState,deckArray,deckId]);

    // If the deck array is loaded and filtered then render the comp, else render a loading screen

        return (
            <div>
                { deckState?
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckName[0]["name"]}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Deck</li>
                  </ol>
                </nav> : (<h5>Nav Bar loading..</h5>)
                  }
                <h1>Edit Deck</h1>
                <DeckForm formStatus={edit}/>
            </div>
                )

}

export default EditDeck;