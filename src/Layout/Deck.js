import React, { useEffect, useState } from "react";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";
import { useHistory, Link, useParams } from "react-router-dom";

/* Known Issues */
// clicking delete too fast doesnt allow state to update on browser screen

function Deck() {
  
  // Deck object from read deack, cards array from read deck object, status of api, delete state, deck id.
  const [deckObject, setDeckObject] = useState({});
  const [cards, setCards] = useState([]);
  const [deckApiStatus, setdeckApiStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteDeckId, setDeleteDeckId] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [isDeleteComplete, setIsDeleteComplete] = useState(false);
  const [deckId, setDeckId] = useState();
  const params = useParams();
  const history = useHistory();

  // Set the deck Id in state
  useEffect(() => {
    setDeckId(params.deckId);
  }, [deckId,params.deckId]);

  // If delete state is off, call the deck and load it into deckObject, and set the API status to true. 
  useEffect(() => {
    if (deckId && deleteDeckId === null) {
      readDeck(deckId).then((deck) => {
        setDeckObject({ ...deck });
        setdeckApiStatus(true);
        setIsDeleteComplete(false);
      });
    }
  }, [deckApiStatus, isDeleteComplete, deckId, deleteDeckId]);

  //Handles the state and api calls to delete cards and decks.
  useEffect(() => {
    if (deleteStatus && deleteDeckId) {
      deleteDeck(deleteDeckId).then(() => {
        setDeleteStatus(false);
        setIsDeleteComplete(true);
        history.push("/");
      });
    } else if (deleteStatus && deleteCardId) {
      deleteCard(deleteCardId).then(() => {
        setDeleteStatus(false);
        setDeleteCardId(null);
        setIsDeleteComplete(true);
      });
    } else {
      return undefined;
    }
  }, [deleteStatus, deleteDeckId, deleteCardId,history]);

  // The "trash can" handler, and window prompts for deleteing decks and cards.
  const trashCanHandler = (deleteDeckId, deleteCardId) => {
    if (deckApiStatus && isNaN(deleteDeckId) && !isNaN(deleteCardId)) {
      if (window.confirm("Delete this deck? You will not be able to recover it.")) {
        setDeleteStatus(true);
      } else {
        setDeleteDeckId(null);
      }
    } else if (deckApiStatus && !isNaN(deleteDeckId) && isNaN(deleteCardId)) {
      if (window.confirm("Delete this Card? You will not be able to recover it.")) {
        setDeleteStatus(true);
      }
    }
  };

  // set the 'render' state for the card table once the api is finished loading the deck. (map the card array of deck object)
  // deps = apistatus and changes to the deckObject
  useEffect(() => {
    if (deckApiStatus) {
      setCards(
        deckObject.cards.map((card) => {
          return (
            <tbody key={card.id}>
              <tr className="border-top border-left border-right">
                <td className="pl-3 pr-3 pt-2">
                  <sub className="text-right text-secondary">Front:</sub>
                  <p>{card.front}</p>
                </td>
                <td className="pl-3 pr-2 pt-2">
                  <sub className="text-right text-secondary">Back:</sub>
                  <p>{card.back}</p>
                </td>
              </tr>
              <tr className="border-bottom border-left border-right">
                <td className="pl-3 pb-2 pr-3">
                  <Link to={`/decks/${deckObject.id}/cards/${card.id}/edit`}>
                    <button name="edit" className="btn btn-secondary mr-1">
                      <span className="oi oi-pencil  mr-1"></span>Edit
                    </button>
                  </Link>
                  <button
                    name="delete"
                    className="btn btn-danger"
                    onClick={() =>
                      trashCanHandler(
                        deleteDeckId,
                        setDeleteCardId(Number(card.id))
                      )
                    }
                  >
                    <span className="oi oi-trash"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          );
        })
      );
    }
  }, [deckApiStatus, deckObject,deleteDeckId]); //trashCanHandler dep left out to prevent endless loop.

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <span className="oi oi-home"></span> Home
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {deckObject.name}
          </li>
        </ol>
      </nav>
      <table>
        <thead>
          <tr>
            <th>
              <h4>{deckApiStatus ? deckObject.name : "Loading.."}</h4>
            </th>
          </tr>
          <tr>
            <td>
              <p>{deckApiStatus ? deckObject.description : "Loading.."}</p>
            </td>
          </tr>
          <tr>
            <td>
              <Link to={`/decks/${deckObject.id}/edit`}>
                <button name="edit" className="btn btn-secondary mr-1 mt-1">
                  <span className="oi oi-pencil  mr-1"></span>Edit
                </button>
              </Link>
              <Link to={`/decks/${deckObject.id}/study`}>
                <button name="study" className="btn btn-primary mr-1 mt-1">
                  <span className="oi oi-book  mr-1"></span>Study
                </button>
              </Link>
              <Link to={`/decks/${deckObject.id}/cards/new`}>
                <button name="addCards" className="btn btn-primary mr-1 mt-1">
                  <span className="oi oi-plus mr-1"></span>Add Cards
                </button>
              </Link>
              <button
                name="delete"
                className="btn btn-danger mt-1"
                onClick={() =>
                  trashCanHandler(
                    setDeleteDeckId(Number(deckObject.id)),
                    deleteCardId
                  )
                }
              >
                <span className="oi oi-trash"></span>
              </button>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="pt-4">
              <h3>Cards</h3>
            </th>
          </tr>
        </tbody>
        {cards.length ? (
          cards
        ) : (
          <tbody>
            <tr>
              <td>
                <p>
                  The Cards are loading, or you need to add cards to the deck.
                </p>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
export default Deck;
