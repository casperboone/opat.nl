import './style.css'

import * as monaco from 'monaco-editor'

const introductionText = `
// Welcome to OPAT.nl!
// -------------------
// Here's an editor you may use to quickly make a note or write a snippet.
// To be honest, I personally mostly use it to strip text formattin 😅.
// Your latest note or snippet will be stored in local storage so no
// worries if you accidentally close this tab. Except if you have multiple
// tabs open, it's not _that_ smart. Enjoy :) 
`.trimStart()

function getInitialValue() {
  if (window.localStorage.hasOwnProperty('snippet')) {
    return JSON.parse(window.localStorage.getItem('snippet'))
  }

  return {
    language: 'plaintext',
    value: introductionText
  }
}

const editor = monaco.editor.create(document.querySelector("#container"), {
	value: getInitialValue().value,
  language: getInitialValue().language,
  fontSize: 14,
  lineHeight: 30,
  fontFamily: "Menlo, Monaco, 'Courier New', monospace",
  minimap: { enabled: false, },
})

const supportedLanguages = monaco.languages.getLanguages().map(language => language.id)

document.querySelector('#language-selector')
  .append(
    ...supportedLanguages.map(language => {
      const option = document.createElement("option")
      option.innerText = language
      option.selected = editor.getModel().getModeId() === language
      return option
    })
  )

document.querySelector('#language-selector')
  .addEventListener('change', ({ target }) => {
    monaco.editor.setModelLanguage(editor.getModel(), target.value)
  })

editor.getModel().onDidChangeContent(() => {
  window.localStorage.setItem('snippet', JSON.stringify({
    language: editor.getModel().getModeId(),
    value: editor.getValue(),
  }))
})
