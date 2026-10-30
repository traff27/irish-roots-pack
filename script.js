// Eligibility logic based on DFA "Registering a foreign birth" rules:
// https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/
(function(){
  var form=document.getElementById('quiz-form'),out=document.getElementById('quiz-result'),reset=document.getElementById('quiz-reset');
  var order=['born','parentBorn','grandBorn','parentFbr'];
  var R={
    eligible:['r-eligible','Likely eligible','Based on your answers, you look likely to be eligible for Foreign Birth Registration. The next step is confirming it with the right certificates, which you order yourself from the official issuing offices.',true],
    citizen:['r-citizen','You may already be an Irish citizen','If a parent born on the island of Ireland was an Irish citizen when you were born, you are automatically an Irish citizen and don\'t need the Foreign Births Register. You can apply for an Irish passport directly. Please don\'t buy this pack.',false],
    not:['r-not','Probably not eligible','From your answers, you don\'t appear to qualify through the Foreign Births Register. If a parent registered only after you were born, the DFA says the child is not entitled through that parent. Please don\'t buy this pack. If you think we\'ve got it wrong, email us first.',false],
    check:['r-check','Needs checking','Your situation needs a closer look before anyone spends money. Email us the details and we\'ll tell you honestly whether the pack fits, before you pay.',false],
    bornIreland:['r-check','Needs checking','This pack is for people born outside Ireland. If you were born on the island of Ireland, different rules apply. See the DFA and Citizens Information guidance, or email us.',false]
  };
  function val(n){var e=form.querySelector('input[name="'+n+'"]:checked');return e?e.value:null}
  function show(q,on){form.querySelector('[data-q="'+q+'"]').hidden=!on}
  function result(key){
    var r=R[key],cta=r[3]?'<a class="btn btn-primary" href="'+window.PAYMENT_LINK+'" data-buy>Buy now £99</a><p class="uk-only" data-uk-only>UK residents only</p><p class="refund-note small" data-refund>Refund: if the DFA returns your application for a reason on our pre-post checklist, we refund the £99 in full. Don\'t need the FBR after all? Choose 50% back plus passport help, or a full refund. <a href="#refund">How refunds work</a></p>':'<a class="btn btn-ghost" href="mailto:'+window.CONTACT_EMAIL+'">Email us</a>';
    out.className='result '+r[0];out.innerHTML='<h3>'+r[1]+'</h3><p>'+r[2]+'</p><p class="small">This is a guide based on the DFA\'s published rules, not a legal decision.</p>'+cta;out.hidden=false;reset.hidden=false;
  }
  function evaluate(){
    out.hidden=true;reset.hidden=true;
    var b=val('born');order.slice(1).forEach(function(q){show(q,false)});
    if(!b)return; if(b==='no')return result('bornIreland');
    show('parentBorn',true);var p=val('parentBorn');if(!p)return;
    if(p==='yes')return result('citizen');
    show('grandBorn',true);var g=val('grandBorn');if(!g)return;
    if(g==='yes')return result(p==='unsure'?'check':'eligible');
    show('parentFbr',true);var f=val('parentFbr');if(!f)return;
    if(f==='before')return result(p==='unsure'?'check':'eligible');
    if(f==='unsure'||g==='unsure'||p==='unsure')return result('check');
    return result('not');
  }
  form.addEventListener('change',function(e){
    var i=order.indexOf(e.target.name);
    order.slice(i+1).forEach(function(q){form.querySelectorAll('input[name="'+q+'"]').forEach(function(x){x.checked=false})});
    evaluate();
  });
  reset.addEventListener('click',function(){form.reset();evaluate()});
  document.getElementById('yr').textContent=new Date().getFullYear();
  function openRefund(){var d=document.getElementById('refund');if(d&&location.hash==='#refund')d.open=true}
  window.addEventListener('hashchange',openRefund);openRefund();
})();
// Placeholders, replaced at launch:
window.PAYMENT_LINK='https://buy.stripe.com/7sY8wPaWc0ZJ6Gn6VPaAw01';window.CONTACT_EMAIL='hello@irishrootspack.com';
