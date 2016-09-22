function SyllableChoiceButton(attributes) {
    Button.call(this, attributes);
}

SyllableChoiceButton.prototype = Object.create(Button.prototype);

SyllableChoiceButton.prototype.onClick = function () {
    addSyllableToInput(this.text);
};