import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { readDeck, readCard } from "../utils/api";
import CardForm from "./CardForm";


function EditCard(){

    //set the default state of the card object and the deck object
    const initialDeckState = {
        name:"",
        description:""
    };

    const initialCardState = {
        front:"",
        back:"",
        deckId: 0,
        id: 0
    };

    //deckObject, cardObject, deckAPI, and CardAPI are related to api calls to get card and deck info to pass down to edit card form
    const[deckObject, setDeckObject] = useState(initialDeckState);
    const[cardObject, setCardObject] = useState(initialCardState)
    const[deckApiStatus,setDeckApiStatus] = useState(false);
    const[cardApiStatus,setCardApiStatus] = useState(false);
    const [deckId, setDeckId] = useState();
    const [cardId, setCardId] = useState();
    const [cardNumber, setCardNumber] = useState();
    const params = useParams();

    // props sent to card form that set the button names and tell the form which code to execute. 
    const editCard = "edit";
    const buttonSubmit = "Submit";
    const buttonCancel = "Cancel";

    // Set the card and deck Id in state
    useEffect(()=>{
        setDeckId(params.deckId);
        setCardId(params.cardId);
    },[deckId,cardId,params.deckId,params.cardId]);

    // call read deck to get the deck to edit (as per requirements) set the API status as "true" or finished loading
    useEffect(()=>{
        if (deckId) {
            readDeck(deckId).then((deck) =>{
                setDeckObject({...deck});
                setDeckApiStatus(true);
            });
        };
    },[deckApiStatus,deckId]);

    // call read card to get the card to edit (as per requirements) set the API status as "true" or finished loading
    useEffect(()=>{
        if (cardId) {
            readCard(cardId).then((card) =>{
                setCardObject({...card});
                setCardApiStatus(true);
            });
        };
    },[cardApiStatus,cardId]);

    // get a card number to display in the breadcrumb nav bar and set that number into state.
    useEffect(()=>{
        if(deckApiStatus){
            deckObject.cards.find((element, index)=> {
                if (element.id === cardId){
                    setCardNumber(index + 1);
                    return element
                };
            });
        };
    },[deckApiStatus,cardNumber,cardId,deckObject.cards]);

    // pass everything down to cardform
    return  (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckObject.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Card {cardNumber}</li>
                </ol>
            </nav>
            <h1>Edit Card</h1>
            <CardForm formStatus={editCard} deck={deckObject} card={cardObject} buttonOne={buttonSubmit}  buttonTwo={buttonCancel} apiStatus={cardApiStatus} />
        </div>);
}

export default EditCard; 