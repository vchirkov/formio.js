import _ from 'lodash';
import BaseComponent from '../base/Base';

export default class ContentComponent extends BaseComponent {
  static get BUILDER_EDITOR_DEBOUNCE() {
    return 350;
  }

  static schema(...extend) {
    return BaseComponent.schema({
      label: 'Content',
      type: 'content',
      key: 'content',
      input: false,
      html: ''
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Content',
      group: 'basic',
      icon: 'fa fa-html5',
      documentation: 'http://help.form.io/userguide/#content-component',
      weight: 100,
      schema: ContentComponent.schema()
    };
  }

  get defaultSchema() {
    return ContentComponent.schema();
  }

  get wysiwygDefault() {
    return {
      theme: 'snow',
      placeholder: this.t(this.component.placeholder),
      modules: {
        clipboard: {
          matchVisual: false
        },
        toolbar: [
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          ['bold', 'italic', 'underline', 'strike', { 'script': 'sub' }, { 'script': 'super' }, 'clean'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image']
        ]
      }
    };
  }

  setHTML() {
    this.htmlElement.innerHTML = this.interpolate(this.component.html);
  }

  build() {
    this.createElement();
    this.htmlElement = this.ce('div', {
      id: this.id,
      class: `form-group ${this.component.className}`
    });

    this.htmlElement.component = this;

    if (this.options.builder) {
      const editorElement = this.ce('div');
      this.element.appendChild(editorElement);
      this.editorReady = this.addQuill(editorElement, null, (html) => {
        this.component.html = html;
      }).then((editor) => {
        this.editor = editor;
        this.editor.on('text-change', _.debounce(() => {
          this.root.emit('change', this.root.form);// update formbuilder of changed content
        }, ContentComponent.BUILDER_EDITOR_DEBOUNCE));
        this.editor.clipboard.dangerouslyPasteHTML(this.component.html);
        return editor;
      }).catch(err => console.warn(err));
    }
    else {
      this.setHTML();
      if (this.component.refreshOnChange) {
        this.on('change', () => this.setHTML(), true);
      }
    }

    this.element.appendChild(this.htmlElement);
    this.attachLogic();
  }

  get emptyValue() {
    return '';
  }

  destroy() {
    return super.destroy();
  }
}
