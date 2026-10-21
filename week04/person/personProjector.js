import {VALUE, VALID, EDITABLE, LABEL} from "../kolibri/presentationModel.js";

export { personListItemProjector, personFormProjector }

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    // todo: the label property should be shown as a pop-over on the text element.

};

const personTextProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const personListItemProjector = (masterController, selectionController, rootElement, person) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removePerson(person);


    const firstnameInputElement = document.createElement("INPUT"); // todo create the input fields and bind to the attribute props
    const lastnameInputElement  = document.createElement("INPUT");
    bindTextInput(person.firstname, firstnameInputElement);
    bindTextInput(person.lastname , lastnameInputElement);

    // todo: when a line in the master view is clicked, we have to set the selection

    firstnameInputElement.onclick = _evt => selectionController.setSelectedPerson(person);
    lastnameInputElement .onclick = _evt => selectionController.setSelectedPerson(person);

    selectionController.onPersonSelected(
        selected => selected === person
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onPersonRemove( (removedPerson, removeMe) => {
        if (removedPerson !== person) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(firstnameInputElement);
        rootElement.removeChild(lastnameInputElement);
        // todo: what to do with selection when person was removed?
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(firstnameInputElement);
    rootElement.appendChild(lastnameInputElement);
    // todo: what to do with selection when person was added?
    selectionController.setSelectedPerson(person);
};

const personFormProjector = (detailController, rootElement, person) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="detail-form">
            <LABEL for="firstname"></LABEL>
            <INPUT TYPE="text" size="20" id="firstname">   
            <LABEL for="lastname"></LABEL>
            <INPUT TYPE="text" size="20" id="lastname">   
        </DIV>
    </FORM>`;

    const firstnameInputEl = divElement.querySelector("#firstname");
    const lastnameInputEl  = divElement.querySelector("#lastname");
    // todo: bind text values
    detailController.onPersonSelected( person => {
        bindTextInput(person.firstname, firstnameInputEl);
        bindTextInput(person.lastname,  lastnameInputEl);
    });

    // todo: bind label values

    rootElement.firstChild.replaceWith(divElement); // react - style ;-)
};
