import React, { useEffect, useState } from "react";
import { createDeck, updateDeck, readDeck } from "../utils/api"
import { useHistory, useParams } from "react-router-dom";


function DeckForm({namePlaceHoler, decriptPlaceHolder, formStatus}){

    // Set the inital deck state object.
    const initalDeckState = {
        name: "",
        description:""
    };

    // Set state variables for the deck object and deck Id.
    const [deckObject, setDeckObject] = useState(initalDeckState);
    const [deckId, setDeckId] = useState();
    const params = useParams();
    const history = useHistory();

    // Set the deck ID from the params hook.
    useEffect(()=>{
        setDeckId(params.deckId);
    },[deckId,params.deckId]);

    // If form is used for editing, load the deck with the right deck id.
    useEffect(()=>{
        if(formStatus === "edit" && deckId){
            readDeck(deckId).then(res =>{
                setDeckObject({...res});
            });
        };
    },[deckId,formStatus]);

    // A handler for getting, and setting form data in deckObject.
    const changeHandler = ({target}) => {
        setDeckObject({
            ...deckObject, 
            [target.name]:target.value
        });
    };

    // A form Handler for both edit and create depending on which prop the comp gets, also redirects user to deck screen
    const formHandler = (event) => {
        event.preventDefault();
        if (formStatus === "create") {
            createDeck(deckObject).then((newDeck) =>{
                setDeckObject({...initalDeckState});
                history.push(`/decks/${newDeck.id}`);
            });
        } else if (formStatus === "edit") {
            updateDeck(deckObject).then(()=>{
                setDeckObject({...initalDeckState});
                history.push(`/decks/${deckObject.id}`);
            });
        };

    };
    
    return (
        <form id="creatEditDeckForm" onSubmit={formHandler} >
            <label htmlFor="name">Name</label><br/>
            <input name="name" id="name" type="text" className="form-control" placeholder={namePlaceHoler} onChange={changeHandler} value={deckObject.name}/><br/>
            <label htmlFor="description">Description</label><br/>
            <textarea name ="description" id="description" rows="6" cols="80" className="form-control" placeholder={decriptPlaceHolder} onChange={changeHandler} value={deckObject.description}/> <br/>
            <button name="cancel" type="reset" form="creatEditDeckForm" className="btn btn-secondary mr-2" onClick={()=>formStatus === "create"? history.push("/"): history.push(`/decks/${deckObject.id}`)}>Cancel</button>
            <button name="submit" type="submit" form="creatEditDeckForm" className="btn btn-primary">Submit</button>
        </form>
    )


}

export default DeckForm;