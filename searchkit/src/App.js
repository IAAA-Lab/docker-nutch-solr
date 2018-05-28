import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters, QueryAccessor,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, TagFilterList} from 'searchkit'
import './index.css'

import { RefinementAutosuggest } from "@searchkit/refinement-autosuggest"
import { SearchkitAutosuggest, FacetFilterDatasource, SuggestQuerySource } from "@searchkit/autosuggest"


const host = "http://localhost/nutch/doc"
const searchkit = new SearchkitManager(host)
const docModel = ["boost","content","digest","host","id","segment","title","tstamp","url"]

const InfoLiveView = (props) => {
    if (props.fields !== undefined){
        const object = props.fields;
        const fields = Object.keys(object).map((key) =>
            <li key={key}> <strong>{key}:</strong> {object[key]}</li>
        );

        return (
          <ul>{fields}</ul>
        )
    } else {
        return (<h5>No body info</h5>);
    }
};

const MovieHitsListItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
    <div className={bemBlocks.item("details")}>
        <h1>{source.title || "<No title>"}</h1>
        <h3>Data types: <TagFilterList field="type.raw" values={source.type} /></h3>
        <h3>Host: {source.host || "<no-host>"}</h3>
        <h5>Date: {source.date || "<no-date>"}</h5>
        <h5>Last Modified: {source.lastModified || "<no-las-modified>"}</h5>
        <h5>Content length: {source.contentLength || "<no-length>"}</h5>
        <a target="_blank" href={source.url || '#'}>{source.url || "<no-url>"}</a>
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
                    fields:["content","title","anchor"]
                  })
                }
                sources={[
                  new SuggestQuerySource(),
                  new FacetFilterDatasource({accessorId:"title"}),
                  new FacetFilterDatasource({ accessorId:"type"})
                ]}
            />
          </TopBar>

        <LayoutBody>

          <SideBar>
          <RefinementAutosuggest multi={true} operator="OR" id="type" title="Type" field="type" size={10}/>
          <RefinementAutosuggest operator="OR" id="title" title="Title" field="title.raw"/>
          <DynamicRangeFilter field="contentLength" id="contentLength" title="Size" rangeFormatter={(count)=> count}/>

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
