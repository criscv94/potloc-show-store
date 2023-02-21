# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StoresChannel, :type => :channel do
  it "subscribes to a stream when store id is provided" do
    store = create(:store)
    subscribe(store_id: store.id)
    expect(subscription).to be_confirmed
    expect(subscription).to have_stream_from("store_#{store.id}")
  end
end
