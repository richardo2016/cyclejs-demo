import { run } from '@cycle/run';
import { makeDOMDriver, div, button, h2 } from '@cycle/dom';

function main(sources) {
    const add$ = sources.DOM
        .select('.add')
        .events('click')
        .map(ev => 1);

    const count$ = add$.fold((total, change) => total + change, 0);

    return {
        DOM: count$.map(count =>
            div('.counter', [
                h2('#abc', 'cyclejs demo'),
                'Count: ' + count,
                button('.add', 'Add')
            ])
        )
    };
}

const drivers = {
    DOM: makeDOMDriver('#app')
}

run(main, drivers);