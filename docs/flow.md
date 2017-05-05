# Flyt

- Sjekker om det ligger jobb i kø-mappen
    - Hvis ikke: avslutter roboten
- Henter jobb og data
- Lagrer jobb i notifications-mappen dersom jobben ikke er dokumentasjon av elevsamtale
- Setter opp data-objektet for videre flyt
- Setter opp dokumentet som skal genereres
- Gjør oppslag mot dsf
- Setter opp dokument for eventuell distribusjon
- Gjør oppslag mot sak/arkiv
- Setter opp nødvendige dokumentmaler
- Genererer dokumenter
- Lagrer jobb i done-mappen hvis ingen feil har oppstått
- Lagrer jobb i feilmappen dersom feil har oppstått
- Sletter genererte dokumenter dersom feil har skjedd
- Sletter jobb fra kø-mappen