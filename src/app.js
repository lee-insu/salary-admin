import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import style from './app.module.css';
import AppContentMgt from './components/app_content_mgt/app_content_mgt';
import AppContentUpload from './components/app_content_upload/app_content_upload';
import KeywordMgt from './components/keyword_mgt/keyword_mgt';
import ResearchMgt from './components/research_mgt/research_mgt';
import ResearchUpload from './components/research_upload/research_upload';

function App() {



  return (
    <div className={style.app}>
       <BrowserRouter>
         <div className={style.ul}>
                <div>관리자모드</div>
                <ul>
                  <li><Link to='/'>app_content_mgt</Link></li>
                  <li><Link to='/keywordmgt'>keyword_mgt</Link></li>
                  <li><Link to='/researchmgt'>research_mgt</Link></li>
                  -
                  <li><Link to='/appupload'>app_content_upload</Link></li>
                  -
                  <li><Link to='/researchupload'>research_upload</Link></li>
                </ul>
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
