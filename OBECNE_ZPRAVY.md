# Systém obecných zpráv

## Přehled
Systém obecných zpráv umožňuje registrovaným uživatelům posílat zprávy jakémukoli dítěti na táboře. Na rozdíl od původního systému zpráv, které byly vázané na konkrétní přihlášky, obecné zprávy vyžadují pouze jméno dítěte.

## Funkcionality

### Pro uživatele
- **Odesílání zpráv**: Kdokoli s účtem může poslat zprávu
- **Jednoduché rozhraní**: Stačí zadat jméno dítěte, vlastní jméno a zprávu
- **Přístup z více míst**: Hlavní menu, uživatelský profil, speciální stránka

### Pro administrátory
- **Správa zpráv**: Zobrazení všech obecných zpráv
- **Moderace**: Možnost mazání nevhodných zpráv
- **Export do PDF**: Tisk zpráv pro předání dětem
- **Filtrování**: Vyhledávání podle jména dítěte, odesílatele nebo obsahu
- **Statistiky**: Přehled celkového počtu zpráv

## Technické detaily

### Databáze
- **Kolekce**: `generalMessages`
- **Struktura**:
  ```
  {
    childName: string,
    message: string,
    senderName: string,
    timestamp: serverTimestamp(),
    isGeneral: boolean
  }
  ```

### Stránky a komponenty
- `/app/(non-layout)/send-general-message/page.tsx` - Formulář pro odesílání
- `/components/AdminGeneralMessages.tsx` - Správa pro adminy
- Integrováno do admin panelu jako nový tab

### Bezpečnost
- Vyžaduje přihlášení
- Všechny zprávy jsou moderovány
- Možnost smazání nevhodného obsahu

## Návod k použití

### Odesílání zprávy
1. Přihlásit se na web
2. Kliknout na "Poslat zprávu" v menu nebo na profilu
3. Vyplnit jméno dítěte, vlastní jméno a zprávu
4. Odeslat

### Správa zpráv (admin)
1. Přihlásit se jako admin
2. Přejít na admin panel
3. Vybrat tab "Obecné zprávy"
4. Filtrovat, vybrat a exportovat dle potřeby
