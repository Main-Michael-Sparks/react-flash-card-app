import React, { useEffect, useState } from "react";
import { createCard, updateCard } from "../utils/api"
import { useHistory } from "react-router-dom";


function CardForm({formStatus, apiStatus, deck, card, buttonOne, buttonTwo}){
    
    // holds the state of the cardForm
    const[cardForm, setCardForm] = useState({...card});
    const history = useHistory();

    // fix for initial card state prop being sent instead of card data
    useEffect(()=>{
        if (formStatus === "edit" && apiStatus) {
            setCardForm({...card});
        };
    },[apiStatus,card,formStatus]);

    // capture the card form data, and set it in cardform use state
    const changeHandler = ({target}) => {
        setCardForm({
            ...cardForm, 
            [target.name]:target.value
        });
    };

    // capture the form submit, either update a card, or create a card depending on the parent comp sending props
    const formHandler = (event) => {
        event.preventDefault();
        if (formStatus === "add") {
            createCard(deck.id,cardForm).then((res) =>{
                setCardForm({...card});

            });
        } else if (formStatus === "edit") {
                updateCard(cardForm).then(()=>{
                    setCardForm({...card});
                    history.push(`/decks/${deck.id}`);
            });
        };
    };

    // set a handler for redirects as per requirements
    const buttonHandler = () => {
        history.push(`/decks/${deck.id}`);
    };

    return (
        <form id="addEditCardsForm" onSubmit={formHandler}>
            <label htmlFor="fontTextArea">Front</label>
            <br/>
            <textarea name="front" id="front" form="addEditCardsForm" rows="6" cols="80" className="form-control" onChange={changeHandler} value={cardForm.front} /> 
            <br/>
            <label htmlFor="backTextArea">Back</label>
            <br/>
            <textarea name="back" id="back" form="addEditCardsForm" rows="6" cols="80" className="form-control" onChange={changeHandler} value={cardForm.back} />
            <br/>
            <button name={buttonTwo} type="cancel" form="addEditCardsForm" className="btn btn-secondary mr-2"onClick={buttonHandler} >{buttonTwo}</button>
            <button name={buttonOne} type="submit" form="addEditCardsForm" className="btn btn-primary">{buttonOne}</button>
        </form>
    );
}

export default CardForm;