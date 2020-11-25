import React from 'react';

export default function FreeForm() {

    const handleData = () => {
        let os = require('os');


        const text = document.getElementById("textArea").value;
        let list = text.split(os.EOL);
        console.log(list)
    }

    return (
        <div className="freeform">

            <div>
                <textarea name="comment" form="transactions" id="textArea" rows="30" cols="200" defaultValue=""/>
                <input type="submit" onClick={() => handleData()}/>
            </div>

        </div>

    );
}