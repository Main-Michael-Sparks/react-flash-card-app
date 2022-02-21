import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";

/* Known Issues */
//timeout function repeats.

function Study() {

    // State Variables: status of API call, sets the deck, flips cards, gets new cards.
    const [currentDeck, setCurrentDeck] = useState({});
    const [apiCallStatus, setApiCallStatus] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);
    const [cardFace, setCardFace] = useState("front");
    const [deckId, setDeckId] = useState();
    const params = useParams();
    const history = useHistory();

    // Get the deck Id from params and set it in state.
    useEffect(()=>{
        setDeckId(params.deckId);
    },[params.deckId]);

    // Makes an API call to get the required deck, sets the apiCallStatus to true if successful.
    useEffect(()=>{
        if(deckId) {
            readDeck(deckId).then(res=>{
                setCurrentDeck({...res});
                setApiCallStatus(true);
            });
        };
    },[deckId]);

    // Flip button hander: "flips" the card from front to back (true or false) which then changes the object:key to "front" or "back"
    const cardFlipHandler = () => {
        if (isFlipped) {
            setIsFlipped(false);
            setCardFace("front");
        } else if (!isFlipped) {
            setIsFlipped(true);
            setCardFace("back");
        };
    };

    // Next button handler: sets "isFlipped" to false, "cardFace" to front, and adds to the "currentCard" (cards array index number)
    // Also handles the prompt to restart the deck or return to the home screen after clicking next on the back of the very last card.
    const nextCardHandler = () => {
        if(isFlipped && currentCard !== (currentDeck.cards.length -1)) {
            setIsFlipped(false);
            setCardFace("front");
            setCurrentCard(currentCard + 1);
        } else if (currentCard === (currentDeck.cards.length -1) && cardFace === "back"){
            //If user clicks next at the end of the deck, triggers the deck reset or home screen
            if (window.confirm("Restart Cards? Click 'cancel' to return the home page.")){
                setIsFlipped(false);
                setCardFace("front");
                setCurrentCard(0);
            } else {
                history.push("/");
            };
        };
    };

    // Sets a timer to trigger a deck reset or home screen after the "back" of the last card.  
    useEffect(()=>{
        if (apiCallStatus && currentCard === (currentDeck.cards.length -1) && cardFace === "back") {
            setTimeout(()=>{
                if (window.confirm("Restart Cards? Click 'cancel' to return the home page.")){
                    setIsFlipped(false);
                    setCardFace("front");
                    setCurrentCard(0);
                } else {
                    history.push("/");
                }
            },10000);
        };
    },[apiCallStatus, currentDeck, currentCard, cardFace, isFlipped, history])

    //if Api call is finished load the page, otherwise show a message that the page is loading. 
    if (apiCallStatus && currentDeck.cards.length >= 3 ){ 
        return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{currentDeck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Study</li>
                </ol>
            </nav>
            <table>
                <thead>
                    <tr>
                        <th>
                            <h1>Study: {currentDeck.name}</h1>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-left border-right border-top">
                        <td className="pt-3 pl-3">
                            <h5>Card {currentCard + 1} of {currentDeck.cards.length}</h5>
                        </td>
                    </tr>
                    <tr className="border-left border-right border-bottom">
                        <td className="pl-3 pb-3 pr-3 pt-2">
                            <p>{currentDeck.cards[currentCard][cardFace]}</p>
                            <button name="flip" className="btn btn-secondary" onClick={()=>cardFlipHandler()}>Flip</button>
                            {isFlipped? <button name="next" className="btn btn-primary ml-2" onClick={()=>nextCardHandler()}>Next</button> : null}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
            ) 
        } else if(apiCallStatus && currentDeck.cards.length < 3) {
           return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/"><span className="oi oi-home"></span> Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{currentDeck.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Study</li>
                </ol>
            </nav>
          <table>
                <thead>
                    <tr>
                        <th>
                            <h1>Study: {currentDeck.name}</h1>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h3>Not enough cards.</h3>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>You need at least 3 cards to study. There are {currentDeck.cards.length} in this deck.</p>
                        </td>
                    </tr>
                    <tr>
                        <td> 
                            <Link to={`/decks/${currentDeck.id}/cards/new`}>
                                <button name="addCards" className="btn btn-primary mr-1" ><span className="oi oi-plus mr-1"></span>Add Cards</button>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>)
        } else {
            return (<h5>Please wait while we load your flash cards...</h5>)
        };

}



export default Study; 