import logo from './logo.svg';
import styles from './App.module.css';
import PocketBase from 'pocketbase';
import {createEffect, createResource, createSignal, For, Match, Suspense, Switch} from "solid-js";

const pb = new PocketBase('http://127.0.0.1:8090');

async function getCats(source, {value, refetching}) {
    return await pb.collection('cats').getList(1, 20, {});
}

/*
// @request.auth.id != ""
if (!pb.authStore.isValid) {
    console.log("Not authenticated")
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    console.log("After authentication")
}
*/

function App() {

    const [$cats] = createResource(getCats);

    return (
        <div class={styles.App}>
            <h1>Cats database</h1>
            {/*<pre>{JSON.stringify(cats(), null, 2)}</pre>*/}
            <Switch>
                <Match when={$cats.loading}>
                    <div>Loading...</div>
                </Match>
                <Match when={$cats()}>
                    {$cats().totalItems} cat(s) in database.
                    <For each={$cats().items}>
                        {(item, index) => (
                            <Cat cat={item}/>
                        )}
                    </For>
                </Match>
            </Switch>
        </div>
    );
}

function Cat(props) {
    const cat = props.cat;
    return (
        <div class={styles.cat}>
            <div>
                {cat.name} {cat.adopted ? "(✔ adopté)" : "(✘ non adopté)"}
            </div>
            <div class={styles.catPhotos}>
                <For each={cat.photo}>
                    {(item, index) => {
                        const url = `http://localhost:8090/api/files/cats/${cat.id}/${item}`;
                        return <img src={url} alt="Test image"/>
                    }
                    }
                </For>
            </div>
        </div>
    );
}

export default App;
