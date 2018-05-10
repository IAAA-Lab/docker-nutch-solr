import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters, QueryAccessor,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'

import { RefinementAutosuggest } from "@searchkit/refinement-autosuggest"
import { SearchkitAutosuggest, FacetFilterDatasource, SuggestQuerySource } from "@searchkit/autosuggest"


const host = "http://localhost:9200/nutch/doc"
const searchkit = new SearchkitManager(host)
const docModel = ["boost","content","digest","host","id","segment","title","tstamp","url"]

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        <img alt="presentation" data-qa="poster" src={result._source.poster}/>
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.title}}></h2></a>
        <h3 className={bemBlocks.item("subtitle")}>Released in {source.year}, rated {source.imdbRating}/10</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.plot}}></div>
      </div>
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <div className="my-logo">MAPAMA Demo</div>
            <SearchkitAutosuggest
                autofocus={true}
                queryHandler={
                  new QueryAccessor("q", {
                    fields:["content"]
                  })
                }
                sources={[
                  new SuggestQuerySource(),
                  new FacetFilterDatasource({accessorId:"title"}),
                  new FacetFilterDatasource({ accessorId:"urlInput"})
                ]}
            />
          </TopBar>

        <LayoutBody>

          <SideBar>
            <RefinementAutosuggest operator="OR" title="Title" id="title" field="title"/>
            <RefinementAutosuggest operator="OR" title="Url" id="url" field="url"/>
            <DynamicRangeFilter field="_score" id="score" title="score" rangeFormatter={(count)=> count + "*"}/>
            <InputFilter id="urlInput" searchThrottleTime={500} title="url" searchOnChange={true} queryFields={["url"]} />

          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"released", order:"desc"},
                  {label:"Earliest Releases", field:"released", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <Hits
                hitsPerPage={12}
                highlightFields={["url","content"]}
                mod="sk-hits-list"
                itemComponent={MovieHitsListItem}
            />
            <NoHits suggestionsField={"content"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
