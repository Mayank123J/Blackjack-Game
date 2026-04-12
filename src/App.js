import { useState } from "react";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
  { rank: "A", value: 11 }, { rank: "2", value: 2 }, { rank: "3", value: 3 },
  { rank: "4", value: 4 }, { rank: "5", value: 5 }, { rank: "6", value: 6 },
  { rank: "7", value: 7 }, { rank: "8", value: 8 }, { rank: "9", value: 9 },
  { rank: "10", value: 10 }, { rank: "J", value: 10 }, { rank: "Q", value: 10 }, { rank: "K", value: 10 }
];

function createDeck() {
  const deck = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank: rank.rank, value: rank.value });
  return deck.sort(() => Math.random() - 0.5);
}

function calcValue(cards) {
  let value = 0, aces = 0;
  for (const card of cards) { value += card.value; if (card.rank === "A") aces++; }
  while (value > 21 && aces > 0) { value -= 10; aces--; }
  return value;
}

const isRed = (suit) => suit === "♥" || suit === "♦";

function CardComponent({ card, hidden = false, delay = 0 }) {
  const red = isRed(card?.suit);
  return (
    <div style={{
      width: 75, height: 108, borderRadius: 10, position: "relative", flexShrink: 0,
      background: hidden ? "linear-gradient(135deg,#1a3a2a,#0d2218)" : "#fff",
      border: hidden ? "2px solid #2a5a3a" : "2px solid #ddd",
      boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
      animation: `dealCard 0.3s ease ${delay}s both`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "6px 8px", overflow: "hidden",
    }}>
      {hidden ? (
        <div style={{
          position: "absolute", inset: 4, borderRadius: 7,
          background: "repeating-linear-gradient(45deg,#1a4a2a 0px,#1a4a2a 4px,#0d2a18 4px,#0d2a18 8px)",
          border: "1px solid #2a5a3a",
        }} />
      ) : (<>
        <div style={{ fontSize: 13, fontWeight: 800, color: red ? "#d32f2f" : "#1a1a1a", lineHeight: 1.1 }}>
          {card.rank}<br />{card.suit}
        </div>
        <div style={{ fontSize: 30, textAlign: "center", color: red ? "#d32f2f" : "#1a1a1a", lineHeight: 1 }}>
          {card.suit}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: red ? "#d32f2f" : "#1a1a1a", lineHeight: 1.1, alignSelf: "flex-end", transform: "rotate(180deg)" }}>
          {card.rank}<br />{card.suit}
        </div>
      </>)}
    </div>
  );
}

function Hand({ cards, hideFirst = false, label, value, showValue }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#a0c4a0", marginBottom: 10, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", minHeight: 108, flexWrap: "wrap" }}>
        {cards.map((card, i) => <CardComponent key={i} card={card} hidden={i === 0 && hideFirst} delay={i * 0.1} />)}
      </div>
      {showValue && (
        <div style={{ marginTop: 10, fontSize: 13, color: value > 21 ? "#ff5252" : "#f0d060", fontWeight: 600 }}>
          {value > 21 ? `BUST (${value})` : `Value: ${value}`}
        </div>
      )}
    </div>
  );
}

function Chip({ amount, onClick, disabled }) {
  const colors = { 5: ["#e53935","#b71c1c"], 10: ["#1565c0","#0d47a1"], 25: ["#2e7d32","#1b5e20"], 100: ["#6a1b9a","#4a148c"] };
  const [bg1, bg2] = colors[amount];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 56, height: 56, borderRadius: "50%", border: `3px dashed ${bg1}88`,
      background: `radial-gradient(circle at 35% 35%, ${bg1}, ${bg2})`,
      color: "#fff", fontWeight: 800, fontSize: 13,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
      opacity: disabled ? 0.5 : 1, transition: "all 0.2s", fontFamily: "'DM Mono',monospace",
    }}
      onMouseOver={e => !disabled && (e.target.style.transform = "translateY(-3px) scale(1.05)")}
      onMouseOut={e => e.target.style.transform = "none"}
    >${amount}</button>
  );
}

function ActionBtn({ onClick, disabled, color, label, primary }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "12px 26px", borderRadius: 10, border: `2px solid ${color}`,
      background: primary ? color : "transparent",
      color: primary ? "#fff" : color,
      fontSize: 12, fontWeight: 700, letterSpacing: 2,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, transition: "all 0.2s",
      fontFamily: "'DM Mono',monospace",
      boxShadow: primary ? `0 4px 20px ${color}44` : "none",
      whiteSpace: "nowrap",
    }}
      onMouseOver={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseOut={e => e.currentTarget.style.transform = "none"}
    >{label}</button>
  );
}

function RuleBlock({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: "#f0d060", letterSpacing: 2, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span><span>{title.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 12, color: "#a0c4a0", lineHeight: 1.6, paddingLeft: 4 }}>{children}</div>
    </div>
  );
}

export default function BlackjackGame() {
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [phase, setPhase] = useState("betting");
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("#f0d060");
  const [stats, setStats] = useState({ wins: 0, losses: 0, ties: 0 });
  const [showRules, setShowRules] = useState(false);

  const playerValue = calcValue(playerCards);
  const dealerValue = calcValue(dealerCards);
  const showMsg = (msg, color = "#f0d060") => { setMessage(msg); setMsgColor(color); };

  const startGame = () => {
    if (bet === 0) { showMsg("Place a bet first!", "#ff5252"); return; }
    const newDeck = createDeck();
    const pCards = [newDeck.pop(), newDeck.pop()];
    const dCards = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck); setPlayerCards(pCards); setDealerCards(dCards);
    setPhase("playing"); setMessage("");
    const pVal = calcValue(pCards), dVal = calcValue(dCards);
    if (pVal === 21 && dVal === 21) { endGame("tie", pCards, dCards, true); return; }
    if (pVal === 21) { endGame("win", pCards, dCards, true); return; }
    if (dVal === 21) { endGame("lose", pCards, dCards, true); return; }
  };

  const hit = () => {
    const newDeck = [...deck], newCard = newDeck.pop();
    const newCards = [...playerCards, newCard];
    setDeck(newDeck); setPlayerCards(newCards);
    const val = calcValue(newCards);
    if (val > 21) endGame("lose", newCards, dealerCards);
    else if (val === 21) stand(newCards);
  };

  const stand = (pCards = playerCards) => {
    setPhase("dealer");
    let dCards = [...dealerCards], newDeck = [...deck];
    while (calcValue(dCards) < 17) dCards.push(newDeck.pop());
    setDealerCards(dCards); setDeck(newDeck);
    setTimeout(() => {
      const pVal = calcValue(pCards), dVal = calcValue(dCards);
      if (dVal > 21 || pVal > dVal) endGame("win", pCards, dCards);
      else if (pVal === dVal) endGame("tie", pCards, dCards);
      else endGame("lose", pCards, dCards);
    }, 800);
  };

  const endGame = (result, pCards, dCards, instant = false) => {
    setTimeout(() => {
      setPhase("over"); setDealerCards(dCards);
      if (result === "win") {
        const bj = calcValue(pCards) === 21 && pCards.length === 2;
        const win = bj ? Math.floor(bet * 2.5) : bet * 2;
        setBalance(b => b + win);
        showMsg(bj ? `🃏 BLACKJACK! +$${win}` : `🎉 YOU WIN! +$${win}`, "#00e676");
        setStats(s => ({ ...s, wins: s.wins + 1 }));
      } else if (result === "tie") {
        setBalance(b => b + bet);
        showMsg("🤝 TIE! Bet returned.", "#f0d060");
        setStats(s => ({ ...s, ties: s.ties + 1 }));
      } else {
        showMsg(`💸 DEALER WINS! -$${bet}`, "#ff5252");
        setStats(s => ({ ...s, losses: s.losses + 1 }));
      }
    }, instant ? 0 : 200);
  };

  const addBet = (amount) => {
    if (balance - amount < 0) { showMsg("Not enough balance!", "#ff5252"); return; }
    setBet(b => b + amount); setBalance(b => b - amount); setMessage("");
  };

  const clearBet = () => { setBalance(b => b + bet); setBet(0); };

  const newRound = () => {
    setBet(0); setPlayerCards([]); setDealerCards([]);
    setPhase("betting"); setMessage("");
    if (balance === 0) { setBalance(1000); showMsg("Refilled to $1000!", "#00e676"); }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "radial-gradient(ellipse at 50% 40%, #0f2a18 0%, #071208 70%)",
      fontFamily: "'DM Mono','Courier New',monospace",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');
        @keyframes dealCard { from{opacity:0;transform:translateY(-30px) rotate(-5deg)} to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        html,body { margin:0; padding:0; }
        * { box-sizing:border-box; margin:0; padding:0; }
        button:focus { outline:none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d2218; }
        ::-webkit-scrollbar-thumb { background: #2a5a3a; border-radius: 2px; }
      `}</style>

      {/* Grid texture */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,#fff 2px,#fff 3px),repeating-linear-gradient(90deg,transparent,transparent 2px,#fff 2px,#fff 3px)" }} />

      {/* Rules Modal */}
      {showRules && (
        <div onClick={() => setShowRules(false)} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.88)", display: "flex",
          alignItems: "center", justifyContent: "center", padding: 16,
          animation: "fadeIn 0.2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#0d2218", border: "2px solid #2a5a3a",
            borderRadius: 20, padding: "28px 24px", maxWidth: 420, width: "100%",
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
            animation: "slideUp 0.25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#f0d060", fontWeight: 700 }}>🃏 How to Play</div>
                <div style={{ fontSize: 10, color: "#4a7a5a", letterSpacing: 2, marginTop: 2 }}>JUST PLAY — IT'S SIMPLE</div>
              </div>
              <button onClick={() => setShowRules(false)} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid #2a5a3a",
                borderRadius: 8, width: 32, height: 32, color: "#a0c4a0", cursor: "pointer", fontSize: 16,
              }}>✕</button>
            </div>
            <RuleBlock icon="🎯" title="Goal">
              Beat the dealer — get closer to <span style={{ color: "#f0d060", fontWeight: 700 }}>21</span> without going over.
            </RuleBlock>
            <RuleBlock icon="🃏" title="Card Values">
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {[["2–10","Face value"],["J Q K","= 10"],["Ace","11 or 1"]].map(([c,v]) => (
                  <div key={c} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a5a3a", borderRadius: 8, padding: "6px 10px", textAlign: "center", flex: 1 }}>
                    <div style={{ color: "#f0d060", fontSize: 13, fontWeight: 700 }}>{c}</div>
                    <div style={{ color: "#a0c4a0", fontSize: 11, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </RuleBlock>
            <RuleBlock icon="🎮" title="Your Turn">
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
                {[["HIT","#c62828","Take another card"],["STAND","#1565c0","Keep your hand"],["DOUBLE DOWN","#4a148c","2× bet, get 1 card"]].map(([btn,color,desc]) => (
                  <div key={btn} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: color, borderRadius: 6, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#fff", minWidth: 90, textAlign: "center", letterSpacing: 1 }}>{btn}</div>
                    <div style={{ fontSize: 12, color: "#a0c4a0" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </RuleBlock>
            <RuleBlock icon="🏆" title="Winning">
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                {[["You > 21","Bust — you lose","#ff5252"],["Dealer > 21","Dealer busts — you win","#00e676"],["You > Dealer","You win 🎉","#00e676"],["Equal","Tie — bet returned","#f0d060"],["21 in 2 cards","BLACKJACK — 2.5× ⭐","#f0d060"]].map(([w,r,c]) => (
                  <div key={w} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, gap: 8 }}>
                    <span style={{ color: "#6a9a7a" }}>{w}</span>
                    <span style={{ color: c, textAlign: "right" }}>{r}</span>
                  </div>
                ))}
              </div>
            </RuleBlock>
            <button onClick={() => setShowRules(false)} style={{
              width: "100%", marginTop: 16, padding: "12px",
              background: "#c9a227", border: "none", borderRadius: 10,
              color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 2,
              cursor: "pointer", fontFamily: "'DM Mono',monospace",
              boxShadow: "0 4px 20px rgba(201,162,39,0.4)",
            }}>LET'S PLAY →</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Header */}
        <div style={{ textAlign: "center", position: "relative" }}>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,5vw,48px)",
            fontWeight: 900, color: "#f0d060", letterSpacing: 2,
            textShadow: "0 0 30px rgba(240,208,96,0.4), 0 2px 4px rgba(0,0,0,0.8)",
          }}>♠ BLACKJACK ♠</h1>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#4a7a5a", marginTop: 4 }}>CASINO ROYALE</div>
          <button onClick={() => setShowRules(true)} style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            background: "rgba(240,208,96,0.1)", border: "1px solid #f0d06044",
            borderRadius: 8, padding: "6px 12px", color: "#f0d060",
            fontSize: 10, letterSpacing: 2, cursor: "pointer", fontFamily: "'DM Mono',monospace",
          }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(240,208,96,0.2)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(240,208,96,0.1)"}
          >HOW TO PLAY</button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 28,
          background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: "10px 20px",
          border: "1px solid #1a3a2a",
        }}>
          {[["BALANCE",`$${balance}`,"#f0d060"],["BET",`$${bet}`,"#00c853"],["W/L/T",`${stats.wins}/${stats.losses}/${stats.ties}`,"#80cbc4"]].map(([label,val,color]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#4a7a5a" }}>{label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: "radial-gradient(ellipse at 50% 30%, #1a4a2a, #0d2a18)",
          border: "3px solid #2a5a3a", borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          padding: "28px 24px",
        }}>
          <Hand cards={dealerCards} hideFirst={phase === "playing"}
            label={`Dealer ${phase === "over" || phase === "dealer" ? `— ${dealerValue}` : ""}`}
            value={dealerValue} showValue={phase === "over" || phase === "dealer"}
          />
          <div style={{ borderTop: "1px solid #2a5a3a", margin: "20px 0", opacity: 0.5 }} />
          {playerCards.length > 0
            ? <Hand cards={playerCards} label={`You — ${playerValue}`} value={playerValue} showValue={true} />
            : <div style={{ textAlign: "center", color: "#2a5a3a", fontSize: 13, letterSpacing: 2, padding: "28px 0" }}>PLACE YOUR BET TO DEAL</div>
          }
        </div>

        {/* Message */}
        <div style={{ minHeight: 28, textAlign: "center" }}>
          {message && (
            <div style={{
              fontSize: "clamp(14px,3vw,20px)", fontWeight: 700,
              color: msgColor, fontFamily: "'Playfair Display',serif",
              textShadow: `0 0 20px ${msgColor}66`,
              animation: "pulse 1.5s ease infinite",
            }}>{message}</div>
          )}
        </div>

        {/* Controls */}
        <div style={{ paddingBottom: 8 }}>
          {phase === "betting" && (
            <div>
              <div style={{ textAlign: "center", fontSize: 10, letterSpacing: 3, color: "#4a7a5a", marginBottom: 12 }}>PLACE YOUR BET</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                {[5,10,25,100].map(amt => <Chip key={amt} amount={amt} onClick={() => addBet(amt)} disabled={balance < amt} />)}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <ActionBtn onClick={clearBet} disabled={bet === 0} color="#555" label="CLEAR BET" />
                <ActionBtn onClick={startGame} disabled={bet === 0} color="#c9a227" label={`DEAL  $${bet}`} primary />
              </div>
            </div>
          )}
          {phase === "playing" && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <ActionBtn onClick={hit} label="HIT" color="#c62828" primary />
              <ActionBtn onClick={() => stand()} label="STAND" color="#1565c0" primary />
              {playerCards.length === 2 && balance >= bet && (
                <ActionBtn onClick={() => { setBalance(b => b - bet); setBet(b => b * 2); stand(); }} label="DOUBLE DOWN" color="#4a148c" primary />
              )}
            </div>
          )}
          {phase === "over" && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ActionBtn onClick={newRound} label="NEXT ROUND →" color="#c9a227" primary />
            </div>
          )}
          {phase === "dealer" && (
            <div style={{ textAlign: "center", color: "#4a7a5a", fontSize: 11, letterSpacing: 3 }}>DEALER PLAYING...</div>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: 9, color: "#1a3a2a", letterSpacing: 2 }}>
          BUILT BY MAYANK JAIN · PHASE 1 PROJECT
        </div>
      </div>
    </div>
  );
}