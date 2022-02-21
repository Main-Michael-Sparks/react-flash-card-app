import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./Header";
import { listDecks, deleteDeck } from "../utils/api";
import NotFound from "./NotFound";
import Deck from "./Deck";
import EditDeck from "./EditDeck";
import CreateDeck from "./CreateDeck";
import AddCard from "./AddCard";
import EditCard from "./EditCard";
import Study from "./Study";
import Home from "./Home";

/*Known issues*/
// If you push the delete button many times in a row, very quickly, it will not always delete the deck.

function Layout() {

  // State lifed from home comp.
  // Store deck, deck Id and delete state.
  const [decksArray, getDecksArray] = useState([]);
  const [deleteDeckId, setDeleteDeckId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const history = useHistory();

  // Call listDecks then filter the object for only deck objects.
  // decksArray dependency left out to prevent useEffect repeat invokes.
  useEffect(() => {
    listDecks().then((response) => {
      const cleanArray = response.filter(element => element.id !== undefined);
      getDecksArray(
        ...decksArray,
           cleanArray
        );
    });
  }, []); // DecksArray dep left out to prevent endless loop.

  // If delete state is true, call DeleteDeck with the deck id then reset the delete state variables.
  useEffect(() => {
    if (deleteStatus) {
      deleteDeck(deleteDeckId).then(() => {
        setDeleteStatus(false);
        setDeleteDeckId(null);
      });
    }
  }, [deleteStatus, deleteDeckId]);

  // Click handler for the delete button, sends a window prompt and sets the delete state ready to delete a deck; refreashs the window when finished.
  const trashCanHandler = (deckId) => {
    if (window.confirm("Delete this deck? You will not be able to recover it.")) {
        setDeleteStatus(true);
        setDeleteDeckId(deckId);
        history.go(0);
    }
  };

  // Setting up routes for all the components, and passing down any lifted props/state.
  return (
    <div>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Home cardDecks={decksArray} eventHandler={trashCanHandler} />
          </Route>
          <Route exact path="/decks/new">
            <CreateDeck />
          </Route>
          <Route exact path="/decks/:deckId">
            <Deck />
          </Route>
          <Route exact path="/decks/:deckId/study">
            <Study />
          </Route>
          <Route exact path="/decks/:deckId/edit">
            <EditDeck deckArray={decksArray} />
          </Route>
          <Route exact path="/decks/:deckId/cards/new">
            <AddCard />
          </Route>
          <Route exact path="/decks/:deckId/cards/:cardId/edit">
            <EditCard />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;