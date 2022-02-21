import React, {useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { readDeck } from "../utils/api"
import CardForm from "./CardForm";

function AddCard(){

    //set the initial deck state
    const initialDeckState = {
        name: "",
        description: ""
    };

    //set a prop to send to cardform
    const initialCardState = {
        front: "",
        back: ""
    };

    //get the deckobject as per requirements
    const [deckObject, setDeckObject] = useState(initialDeckState);
    const [apiCallStatus,setApiCallStatus] = useState(false);
    const [deckId, setDeckId] = useState();
    const params = useParams();

    //set some props for cardform to know what it is dealing with
    const plusCard = "add";
    const buttonSave = "Save";
    const buttonDone = "Done";

    //Extract the URL params and store the deck id in state.
    useEffect(()=>{
        setDeckId(params.deckId)
    },[deckId,params.deckId]);

    //call read deck, set its object in usestate and set the api status to true (finished loading)
    useEffect(()=>{
        if (deckId){
            readDeck(deckId).then((deck) =>{
                setDeckObject({...deck})
                setApiCallStatus(true)
            })
        }
    },[apiCallStatus,deckId]);

    // If the deck is loaded (apiCallStatus) then render the comp, else render a loading screen
    if (apiCallStatus){
            return (
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                            <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckObject.name}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Add Card</li>
                        </ol>
                    </nav>
                    <h1><span className="qualifiedTestFix">{`${deckObject.name}`}</span>: <span className="qualifiedTestFix">Add Card</span></h1>
                    <CardForm formStatus={plusCard} deck={deckObject} card={initialCardState} buttonOne={buttonSave}  buttonTwo={buttonDone}/>
                </div>);
    } else {
        return (<h1>Loading...</h1>);
    };

};

export default AddCard; 


