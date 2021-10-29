import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import style from './app.module.css';
import AppContentMgt from './components/app_content_mgt/app_content_mgt';
import AppContentUpload from './components/app_content_upload/app_content_upload';
import KeywordMgt from './components/keyword_mgt/keyword_mgt';
import Nav from './components/nav/nav';
import ResearchMgt from './components/research_mgt/research_mgt';
import ResearchUpload from './components/research_upload/research_upload';

function App() {



  return (
    <div className={style.app}>

      <Nav/>
       <BrowserRouter>
         <div className={style.list}>
           <div className={style.container}>
                <div className={style.title}>관리자모드</div>
                <ul className={style.ul}>
                <div className={style.sub_title}>메인 화면</div>
                  <ul className={style.sub_ul}>
                     <li className={style.li}><Link to='/researchmgt'>컨텐츠 관리</Link></li>
                     <li className={style.li}><Link to='/'>앱 컨텐츠 관리</Link></li>
                    <li className={style.li}><Link to='/keywordmgt'>카테고리(키워드)관리</Link></li>
                  </ul>
                  <div className={style.sub_title}>앱 화면 </div>
                    <ul className={style.sub_ul}>
                      <li className={style.li}i><Link to='/appupload'>앱 컨텐츠 등록</Link></li>
                    </ul>
                  
                  <div className={style.sub_title}>집중탐구</div>
                    <ul className={style.sub_ul}>
                     <li className={style.li}><Link to='/researchupload'>컨텐츠 등록</Link></li>
                    </ul>
                </ul>
            </div>
          </div>
          <Switch>
            <Route exact path='/' component={AppContentMgt}/>
            <Route exact path='/appupload' component={AppContentUpload}/>
            <Route exact path='/keywordmgt' component={KeywordMgt}/>
            <Route exact path='/researchmgt' component={ResearchMgt}/>
            <Route exact path='/researchupload' component={ResearchUpload}/>
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
