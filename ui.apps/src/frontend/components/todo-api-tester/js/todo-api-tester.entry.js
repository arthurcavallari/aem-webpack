import $ from 'jquery';
import { getTodos } from 'Commons/services/api/api-tester'
import '../scss/todo-api-tester.scss';

const $component = $('#todo-api-tester');
const $shouldFetch = $component.find('#should-fetch');
const $todoNumber = $component.find('#todo-number');
const $button = $component.find('button');
const $output = $component.find('pre');

if($component.length) {
  $button.on('click', function (e) {
    const todoNumber = $todoNumber.val();
    const shouldFetch = !$shouldFetch.is(':checked');

    console.log(todoNumber, shouldFetch);
    $output.html('hello');
    $output.html('hello');
  });
}