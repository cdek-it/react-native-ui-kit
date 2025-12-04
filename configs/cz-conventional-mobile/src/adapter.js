const chalk = require('chalk')
const map = require('lodash.map')
const longest = require('longest')
const wrap = require('word-wrap')
const inquirer = require('inquirer')

const filter = function (array) {
  return array.filter(function (x) {
    return x
  })
}

const headerLength = function (answers) {
  return (
    answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0)
  )
}

const maxSummaryLength = function (options, answers) {
  return options.maxHeaderWidth - headerLength(answers)
}

const filterSubject = function (subject) {
  subject = subject.trim()
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject = subject.charAt(0).toLowerCase() + subject.slice(1, subject.length)
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1)
  }
  return subject
}

module.exports = function (options) {
  inquirer.registerPrompt('search-list', require('inquirer-search-list'))

  const types = options.types
  const length = longest(Object.keys(types)).length + 1
  const choices = map(types, function (type, key) {
    return {
      name: (key + ':').padEnd(length + 4) + ' ' + type.description,
      value: key,
    }
  })

  return {
    prompter: function (cz, commit) {
      cz.prompt([
        {
          type: 'search-list',
          name: 'type',
          message: 'Выберите тип изменений которые вы коммитите:',
          choices: choices,
        },
        {
          type: 'input',
          name: 'scope',
          message:
            'Скоуп изменений (например компонент, модуль или конкретнрый файл): (нажмите enter чтобы пропустить)',
          filter: function (value) {
            return value.trim()
          },
        },
        {
          type: 'input',
          name: 'subject',
          message: function (answers) {
            return (
              'Краткое описание коммита (не больше ' +
              maxSummaryLength(options, answers) +
              ' cимволов):\n'
            )
          },
          validate: function (subject, answers) {
            const filteredSubject = filterSubject(subject)
            return filteredSubject.length == 0
              ? 'требуется описание коммита'
              : filteredSubject.length <= maxSummaryLength(options, answers)
                ? true
                : 'Длина описания коммита должно быть меньше или разняться ' +
                  maxSummaryLength(options, answers) +
                  ' символам. Текущая длина ' +
                  filteredSubject.length +
                  ' символов.'
          },
          transformer: function (subject, answers) {
            const filteredSubject = filterSubject(subject)
            const color =
              filteredSubject.length <= maxSummaryLength(options, answers)
                ? chalk.green
                : chalk.red
            return color('(' + filteredSubject.length + ') ' + subject)
          },
          filter: function (subject) {
            return filterSubject(subject)
          },
        },
        {
          type: 'input',
          name: 'body',
          message: 'Описание изменений: (нажмите enter чтобы пропустить)\n',
        },
      ]).then(function (answers) {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        }

        const scope = answers.scope ? '(' + answers.scope + ')' : ''

        const head = answers.type + scope + ': ' + answers.subject

        const body = answers.body ? wrap(answers.body, wrapOptions) : false

        commit(filter([head, body]).join('\n\n'))
      })
    },
  }
}
