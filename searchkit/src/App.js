import React, { Component } from 'react'
import { extend } from 'lodash'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
  ResetFilters, RangeFilter, NumericRefinementListFilter,
  Hits, ViewSwitcherToggle, DynamicRangeFilter,
  InputFilter, GroupedSelectedFilters, QueryAccessor,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar, TagFilterList,TagFilter, TagFilterConfig, Panel} from 'searchkit'

import { RefinementAutosuggest } from "@searchkit/refinement-autosuggest"
import { SearchkitAutosuggest, FacetFilterDatasource, SuggestQuerySource } from "@searchkit/autosuggest"

import {Label, Accordion} from 'semantic-ui-react'


const host = "/nutch/doc"
const searchkit = new SearchkitManager(host)
const docModel = ["boost","content","digest","host","id","segment","title","tstamp","url"]

const text_fields=["content","text","title","anchor","description","keywords","h1","h2"]
const available_colors = ['red','orange','yellow','olive','green','teal','blue','violet','purple','pink','brown','grey','black']
const colors = {
  pdf: available_colors[0],
  application: available_colors[3],
  "xhtml+xml": available_colors[6]
}

const HitItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.imdb.com/title/" + result._source.imdbId
  const source = extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} key={result._id} data-qa="hit">
      <div className={bemBlocks.item("details")}>
          <a href={source.url || '#'} target="_blank"><h2 className={bemBlocks.item("title")}>
            {source.title || source.h1 || source.h2 || "<No title>"}
          </h2></a>
          <h3 className={bemBlocks.item("subtitle")}>
          Date: {source.date || "<no-date>"}, last
          modified: {source.lastModified || "<no-las-modified>"}, content
          length: {source.contentLength || "<no-length>"}
          </h3>

          <Accordion styled panels={[
            { title: "Contenido de la página", content: { content: source.content,
              key: "content"}},
            { title: "Links salientes", content: { content: (
                <ul> {source.outlinks.map( (e) => (<li><TagFilter field="outlinks" value={e} /></li>) )} </ul> ),
              key: "outlinks"}}
          ]}
          />

          <Label.Group size="medium">
            {source.type.map((e) => (
              <Label color={colors[e]} key={e}><TagFilter field="type" value={e}/></Label>
            ))}
          </Label.Group>

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
                    fields: text_fields
                  })
                }
                sources={[
                  new SuggestQuerySource(),
                  new FacetFilterDatasource({accessorId:"title"}),
                  new FacetFilterDatasource({accessorId:"keywords"}),
                  new FacetFilterDatasource({accessorId:"type"})
                ]}
            />
          </TopBar>

        <LayoutBody>

          <SideBar>
          <RefinementAutosuggest multi={true} operator="OR" id="type" title="Type" field="type" size={10}/>
          <RefinementAutosuggest operator="OR" id="title" title="Title" field="title.raw"/>
          <RefinementAutosuggest operator="OR" id="keywords" title="Keywords" field="keywords.raw"/>
          <DynamicRangeFilter field="contentLength" id="contentLength" title="Size" rangeFormatter={(count)=> count}/>
          <TagFilterConfig id="outlinks" title="Outlinks" field="outlinks" />

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
                highlightFields={text_fields}
                mod="sk-hits-list"
                itemComponent={HitItem}
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
