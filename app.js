let notes = [];

let scrapedNotes = JSON.parse(localStorage.getItem('notesu'));

const sideBarElement = document.querySelector('.notes__sidebar');

const notesAddBtnElement = document.querySelector('.notes__add');
const notesSaveElement = document.querySelector('.notes__save');
const notesDeleteElement = document.querySelector('.notes__delete');

const notesPreviewElement = document.querySelector('.notes__preview');
const notesListElement = document.querySelector('.notes__list');

const notesTitleElement = document.querySelector('.notes__title');
const notesBodyElement = document.querySelector('.notes__body');

const createDescription = (text) => {
  const txt = text.split(' ');

  let formattedText = '';

  for (let i = 0; i < 5; i++) {
    if (txt[i]) {
      formattedText += txt[i] + ' ';
    }
  }

  return formattedText;
};

const loadNotes = () => {
  notesListElement.innerHTML = ``;

  notes.forEach((note) => {
    const div = document.createElement('div');

    div.classList.add('notes__list-item', 'notes__list-item');

    if (note.isSelected) {
      div.classList.add('notes__list-item--selected');
    }
    

    div.innerHTML = `
    <div class="notes__small-title"><b>${note.title}</b></div>
    <div class="notes__small-body">${note.description}</div>
    `;

    div.addEventListener('click', () => {
      notesSaveElement.click();

      if (note.isSelected) {
        save();
        note.isSelected = false;
        notesTitleElement.value = '';
        notesBodyElement.value = '';
        loadNotes();
        isSomethingSelected();
        return;
      }

      save();
      note.deselectOthers();
      isSomethingSelected();
      loadNotes();

      notesTitleElement.value = note.title;
      notesBodyElement.value = note.body;
    });

    notesListElement.append(div);
  });
};

const isSomethingSelected = () => {
  let selected = false;

  notes.forEach((note) => {
    if (note.isSelected) {
      selected = true;
    }
  });

  if (selected) {
    notesAddBtnElement.classList.add('hide');
    notesSaveElement.classList.remove('hide');
    notesDeleteElement.classList.remove('hide');
  } else {
    notesAddBtnElement.classList.remove('hide');
    notesSaveElement.classList.add('hide');
    notesDeleteElement.classList.add('hide');
  }
};

const save = () => {
  notes.forEach((note) => {
    if (note.isSelected) {
      note.update(notesTitleElement.value.trim(), notesBodyElement.value);
      loadNotes();
      localStorage.setItem('notesu', JSON.stringify(notes));
    }
  });
}

class Note {
  constructor(title, body) {
    this.title = title;
    this.description = createDescription(body);
    this.body = body;
    this.id = Math.random();
    this.isSelected = true;
  }

  update(title, body) {
    this.title = title;
    this.description = createDescription(body);
    this.body = body;
  }

  deselectOthers() {
    notes.forEach((note) => {
      if (note.id !== this.id) {
        note.isSelected = false;
      }
    });

    this.isSelected = true;
  }
}

notesAddBtnElement.addEventListener('click', () => {
  if (notesTitleElement.value === '') {
    alert('Please enter a title');
    return;
  }

  const title = notesTitleElement.value.trim();
  const body = notesBodyElement.value;

  const note = new Note(title, body);

  notes.push(note);

  note.deselectOthers();
  loadNotes();
  isSomethingSelected();

  localStorage.setItem('notesu', JSON.stringify(notes));
});

notesSaveElement.addEventListener('click', () => {
  notes.forEach((note) => {
    if (note.isSelected) {
      note.update(notesTitleElement.value.trim(), notesBodyElement.value);
      loadNotes();
      localStorage.setItem('notesu', JSON.stringify(notes));
    }
  });
});

notesDeleteElement.addEventListener('click', () => {
  notes.forEach((note) => {
    if (note.isSelected) {
      notes = notes.filter((n) => n.id !== note.id);
      loadNotes();
      isSomethingSelected();
      notesTitleElement.value = '';
      notesBodyElement.value = '';

      localStorage.setItem('notesu', JSON.stringify(notes));
    }
  });
});

scrapedNotes.forEach((snote) => {
  const note = new Note(snote.title, snote.body);
  note.isSelected = false;

  notes.push(note);
});

loadNotes();

window.addEventListener('beforeunload', () => {
  save();
});
