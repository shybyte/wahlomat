/// <reference path="../../typings/main/index.d.ts" />
import * as React from 'react';
import { Link } from 'react-router';

export class StartPage extends React.Component<{}, {}> {
  render() {
    return (
      <div>
<h2>Willkommen beim ersten Wahl-O-Maten auf Bezirksebene!</h2>

<p>Alle Friedrichshainer und Friedrichshainerinnen können sich hier über die
anstehenden Wahlen am 18.09.2016 über die Standpunkte der einzelnen Kandidaten
informieren.</p>

<p>Wir haben Friedrichshainer und Friedrichshainerinnen nach ihren Anliegen
gefragt. Herausgekommen sind 38 Fragen, die du hier durchklicken kannst.</p>

<p>Wir haben alle in Friedrichshain antretenden Parteien gefragt. Auf den folgenden
Seiten siehst du die Antworten der Listen Ersten für die
Bezirksverordnetenversammlung (BVV) und der Direktkandidaten der
Friedrichshainer Wahlkreise: WK2, WK4, WK5.</p>

<p>Am Ende hast du die Möglichkeit, deine Antworten anonym zu speichern. Damit
können wir sehen, welche Fragen die Friedrichshainer und Friedrichshainerinnen
interessiert und was sie wollen.</p>

<p>Wir möchten lokalpolitischen Themen einen Raum geben, weil wir denken, dass
diese Themen uns alle angehen und wir glauben, dass es einfacher werden muss,
sich einen Überblick zu verschaffen und weil wir mehr Nachbarn zum Wählen
bringen wollen.</p>

<p>Anregungen und Fragen sind sehr willkommen unter <a href='mailto:volker@pollyandbob.com'>volker@pollyandbob.com</a></p>

        <Link to={`/questions/`}>Los geht's! Ab zu den Fragen!</Link>
      </div>
    );
  }
}
