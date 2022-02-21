import React from "react";
import DeckForm from "./DeckForm";
import { Link } from "react-router-dom";


function CreateDeck(){

// DeckForm props; create tells the form which code to run, the others fill place holder information
const create = "create";
const deckName = "Deck Name";
const deckDiscript = "Brief Description of the deck";

    return (
        <div>
            <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Create Deck</li>
            </ol>
            </nav>
            <h1>Create Deck</h1>
            <DeckForm namePlaceHoler={deckName} decriptPlaceHolder={deckDiscript} formStatus={create} />
        </div>
    );
}

export default CreateDeck;